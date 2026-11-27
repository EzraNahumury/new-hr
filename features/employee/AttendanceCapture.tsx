"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, RefreshCw, RotateCcw, Send, User } from "lucide-react";
import { cn } from "@/lib/cn";

type ApproverOption = { userId: number; name: string; role: string };
type Today = { tanggal: string; jamMasuk: string | null; jamPulang: string | null; statusAbsensi: string | null } | null;
type Mode = "check-in" | "check-out";
type CheckInStatus = "hadir" | "izin" | "sakit" | "sakit_tanpa_surat";
type LocationSnapshot = { latitude: number; longitude: number; accuracy: number; capturedAt: number };
type GeofencePopup = { message: string; distanceMeters: number | null; maxRadiusMeters: number; targetLabel: string | null; placement: string | null };

const LOCATION_CACHE_KEY = "web_hr_last_location";
const LOCATION_CACHE_MAX_AGE = 2 * 60 * 1000;

const FILTERS: { id: string; label: string; css: string }[] = [
  { id: "normal", label: "Normal", css: "none" },
  { id: "clarendon", label: "Clarendon", css: "brightness(1.1) contrast(1.2) saturate(1.35)" },
  { id: "gingham", label: "Gingham", css: "brightness(1.05) sepia(0.12) hue-rotate(-10deg)" },
  { id: "moon", label: "Moon", css: "grayscale(1) brightness(1.1) contrast(1.1)" },
  { id: "lark", label: "Lark", css: "brightness(1.12) contrast(0.88) saturate(1.2)" },
  { id: "reyes", label: "Reyes", css: "sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)" },
  { id: "juno", label: "Juno", css: "saturate(1.4) contrast(1.08) brightness(1.05)" },
  { id: "slumber", label: "Slumber", css: "saturate(0.66) brightness(1.05) sepia(0.1)" },
  { id: "valencia", label: "Valencia", css: "sepia(0.18) contrast(1.08) brightness(1.08) saturate(1.1)" },
];

const CHECK_IN_OPTIONS: { value: CheckInStatus; label: string; short: string; helper: string }[] = [
  { value: "hadir", label: "Masuk", short: "O", helper: "Selfie & lokasi wajib." },
  { value: "izin", label: "Izin / Off", short: "X", helper: "Isi keterangan, tanpa selfie." },
  { value: "sakit", label: "Sakit + Surat", short: "S", helper: "Upload surat sakit." },
  { value: "sakit_tanpa_surat", label: "Sakit", short: "SX", helper: "Isi keterangan sakit." },
];

export function AttendanceCapture({
  mode,
  employeeName,
  employeeMeta,
  todayAttendance,
  scheduledShift = null,
  skipEarlyLeaveCheck = false,
  approvers = [],
}: {
  mode: Mode;
  employeeName: string;
  employeeMeta: string;
  todayAttendance: Today;
  scheduledShift?: string | null;
  skipEarlyLeaveCheck?: boolean;
  approvers?: ApproverOption[];
}) {
  const isCheckIn = mode === "check-in";
  const isCheckOutBlocked = mode === "check-out" && (todayAttendance?.statusAbsensi === "izin" || todayAttendance?.statusAbsensi === "sakit");
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const locationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bestAccuracyRef = useRef<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [nowMins, setNowMins] = useState(() => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); });
  const [cameraReady, setCameraReady] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  const [locationPromptActive, setLocationPromptActive] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>("hadir");
  const [sickFile, setSickFile] = useState<File | null>(null);
  const [sickNote, setSickNote] = useState("");
  const [earlyLeaveNote, setEarlyLeaveNote] = useState("");
  const [geofencePopup, setGeofencePopup] = useState<GeofencePopup | null>(null);
  const [blockedPopup, setBlockedPopup] = useState<string | null>(null);
  const [showApprovalFields, setShowApprovalFields] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [assignedApprover, setAssignedApprover] = useState("");
  const [filter, setFilter] = useState(FILTERS[0]);

  const needsSelfie = !isCheckIn || checkInStatus === "hadir";
  const needsSickProof = isCheckIn && checkInStatus === "sakit";
  const showsNote = isCheckIn && (checkInStatus === "izin" || checkInStatus === "sakit" || checkInStatus === "sakit_tanpa_surat");
  const noteIsRequired = isCheckIn && (checkInStatus === "izin" || checkInStatus === "sakit_tanpa_surat");

  const isEarlyLeaveNow = (() => {
    if (isCheckIn || skipEarlyLeaveCheck) return false;
    const jamMasuk = todayAttendance?.jamMasuk;
    if (!jamMasuk) return false;
    const CO: Record<string, number> = { pagi: 990, lembur: 1200, siang: 1200, pagi_full: 990, pagi_short: 870, siang_sore: 990, jne_pagi: 930, jne_siang: 1230, jne_minggu: 1170 };
    const shift = scheduledShift && scheduledShift in CO ? scheduledShift : "pagi";
    return nowMins < (CO[shift] ?? 990);
  })();

  useEffect(() => { const id = setInterval(() => { const d = new Date(); setNowMins(d.getHours() * 60 + d.getMinutes()); }, 60_000); return () => clearInterval(id); }, []);

  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
    if (locationTimeoutRef.current) { clearTimeout(locationTimeoutRef.current); locationTimeoutRef.current = null; }
  }, []);

  const applySnapshot = useCallback((s: LocationSnapshot) => {
    if (bestAccuracyRef.current === null || s.accuracy < bestAccuracyRef.current) {
      bestAccuracyRef.current = s.accuracy;
      setLocation({ latitude: s.latitude, longitude: s.longitude });
      setLocationAccuracy(s.accuracy);
      setLocationReady(true);
      setLocationPromptActive(false);
      setLocationMessage(`Lokasi diperbarui. Akurasi ~${Math.round(s.accuracy)} m.`);
      try { sessionStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(s)); } catch {}
    }
  }, []);

  const startLocationTracking = useCallback((forceRefresh = false) => {
    if (!navigator.geolocation) { setLocationPromptActive(false); setErrorMessage("Browser tidak mendukung GPS lokasi."); return; }
    stopLocationTracking();
    bestAccuracyRef.current = null;
    setIsLocating(true); setLocationPromptActive(true); setLocationMessage("Mencari lokasi saat ini..."); setErrorMessage("");
    if (!forceRefresh) {
      try {
        const saved = sessionStorage.getItem(LOCATION_CACHE_KEY);
        if (saved) { const p = JSON.parse(saved) as LocationSnapshot; if (Date.now() - p.capturedAt <= LOCATION_CACHE_MAX_AGE) applySnapshot(p); else sessionStorage.removeItem(LOCATION_CACHE_KEY); }
      } catch {}
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => applySnapshot({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, capturedAt: Date.now() }),
      () => { setErrorMessage("Izin lokasi dibutuhkan untuk presensi."); setLocationPromptActive(false); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => { applySnapshot({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, capturedAt: Date.now() }); if (pos.coords.accuracy <= 30) { setIsLocating(false); stopLocationTracking(); } },
      () => { setIsLocating(false); setLocationPromptActive(false); setErrorMessage("Izin lokasi dibutuhkan untuk presensi."); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
    locationTimeoutRef.current = setTimeout(() => {
      setIsLocating(false); setLocationPromptActive(false); stopLocationTracking();
      const best = bestAccuracyRef.current;
      if (best !== null) {
        setLocationMessage(
          best > 100
            ? `Akurasi GPS masih rendah (~${Math.round(best)} m). Aktifkan "Lokasi presisi tinggi" di HP, keluar dari dalam ruangan, lalu tekan Refresh.`
            : `Lokasi terbaik ditemukan. Akurasi ~${Math.round(best)} m.`,
        );
      } else {
        setErrorMessage("Lokasi belum berhasil didapatkan. Coba tekan Refresh.");
      }
    }, 25000);
  }, [applySnapshot, stopLocationTracking]);

  useEffect(() => {
    let active = true;
    const t = window.setTimeout(() => startLocationTracking(), 0);
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (!active) { stream.getTracks().forEach((tr) => tr.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraReady(true);
      } catch { setErrorMessage("Izin kamera dibutuhkan untuk selfie presensi."); }
    })();
    return () => { active = false; window.clearTimeout(t); stopLocationTracking(); streamRef.current?.getTracks().forEach((tr) => tr.stop()); };
  }, [startLocationTracking, stopLocationTracking]);

  useEffect(() => { if (!photoDataUrl && videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current; }, [photoDataUrl]);

  function captureSelfie() {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) { setErrorMessage("Kamera belum siap."); return; }
    canvas.width = video.videoWidth || 720; canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setErrorMessage("Gagal memproses selfie."); return; }
    ctx.save(); ctx.translate(canvas.width, 0); ctx.scale(-1, 1); ctx.filter = filter.css;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); ctx.restore();
    setPhotoDataUrl(canvas.toDataURL("image/jpeg", 0.9)); setErrorMessage("");
  }

  function submit() {
    if (isCheckOutBlocked) { setErrorMessage("Status izin/sakit hari ini tidak memerlukan presensi pulang."); return; }
    if (needsSickProof && !sickFile) { setErrorMessage("Upload bukti sakit dulu."); return; }
    if (noteIsRequired && !sickNote.trim()) { setErrorMessage("Keterangan wajib diisi."); return; }
    if (isEarlyLeaveNow && !earlyLeaveNote.trim()) { setErrorMessage("Pulang lebih awal — wajib isi keterangan dulu."); return; }
    if (needsSelfie && (!photoDataUrl || !location)) { setErrorMessage(!photoDataUrl ? "Ambil selfie dulu." : "Lokasi belum tersedia."); return; }
    setErrorMessage(""); setSuccessMessage("");
    startTransition(async () => {
      const endpoint = isCheckIn ? "/api/employee/attendance/check-in" : "/api/employee/attendance/check-out";
      let res: Response;
      if (isCheckIn) {
        const fd = new FormData();
        fd.append("status", checkInStatus);
        fd.append("keterangan", checkInStatus === "hadir" && showApprovalFields ? approvalNote : sickNote);
        if (assignedApprover) fd.append("assignedApproverUserId", assignedApprover);
        if (checkInStatus === "hadir") {
          fd.append("photoDataUrl", photoDataUrl ?? "");
          fd.append("latitude", String(location?.latitude ?? ""));
          fd.append("longitude", String(location?.longitude ?? ""));
          fd.append("accuracy", String(locationAccuracy ?? ""));
        } else if (sickFile) fd.append("sickProof", sickFile);
        res = await fetch(endpoint, { method: "POST", body: fd });
      } else {
        res = await fetch(endpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoDataUrl, latitude: location?.latitude, longitude: location?.longitude, accuracy: locationAccuracy ?? undefined, keterangan: earlyLeaveNote.trim() || undefined, assignedApproverUserId: assignedApprover || undefined }),
        });
      }
      const result = await res.json().catch(() => ({})) as { message?: string; blocked?: boolean; needApproval?: boolean; earlyLeave?: boolean; geofence?: GeofencePopup };
      if (!res.ok) {
        if (result.needApproval || result.earlyLeave) { setShowApprovalFields(true); setErrorMessage(result.message || "Terlambat / pulang awal. Isi keterangan (+ pilih atasan), lalu submit lagi."); }
        else if (res.status === 403 && result.blocked) setBlockedPopup(result.message || "Absensi diblokir. Hubungi admin.");
        else if (res.status === 403 && result.geofence) setGeofencePopup({ message: result.message || "Di luar radius presensi.", distanceMeters: result.geofence.distanceMeters, maxRadiusMeters: result.geofence.maxRadiusMeters, targetLabel: result.geofence.targetLabel, placement: result.geofence.placement });
        else setErrorMessage(result.message || "Presensi gagal disimpan.");
        return;
      }
      setSuccessMessage(result.message || (isCheckIn ? "Presensi masuk berhasil disimpan." : "Presensi pulang berhasil disimpan."));
      if (isCheckIn) { setCheckInStatus("hadir"); setSickFile(null); setSickNote(""); setPhotoDataUrl(null); setShowApprovalFields(false); setApprovalNote(""); setAssignedApprover(""); }
      router.refresh();
    });
  }

  const mapUrl = location ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=18&output=embed` : null;

  return (
    <div className="space-y-4">
      {blockedPopup ? <Popup title="Absensi Diblokir" body={blockedPopup} onClose={() => setBlockedPopup(null)} /> : null}
      {geofencePopup ? (
        <Popup title="Presensi Ditolak" body={geofencePopup.message} onClose={() => setGeofencePopup(null)}>
          {geofencePopup.distanceMeters !== null ? (
            <div className="rounded-lg border border-line bg-surface-2 px-4 py-3 text-center">
              <p className="text-[12px] text-ink-2">Jarak Anda sekarang</p>
              <p className="nums mt-1 text-2xl font-bold text-primary">{Math.round(geofencePopup.distanceMeters)} m</p>
              <p className="mt-0.5 text-[12px] text-ink-2">Maks: {geofencePopup.maxRadiusMeters} m{geofencePopup.targetLabel ? ` · ${geofencePopup.targetLabel}` : ""}</p>
            </div>
          ) : null}
        </Popup>
      ) : null}

      {errorMessage ? <div className="rounded-lg border border-danger/30 bg-danger-weak px-4 py-3 text-[13px] text-danger">{errorMessage}</div> : null}
      {successMessage ? <div className="rounded-lg border border-success/30 bg-success-weak px-4 py-3 text-[13px] text-success">{successMessage}</div> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        {/* Capture card */}
        <section className="overflow-hidden rounded-xl border border-line bg-surface" style={{ boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary text-on-primary"><Camera className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted">Presensi aktif</p>
                <h3 className="truncate text-base font-semibold text-ink">{isCheckIn ? "Check-In Selfie" : "Check-Out Selfie"}</h3>
              </div>
            </div>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", cameraReady ? "bg-success-weak text-success" : "bg-warning-weak text-warning")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", cameraReady ? "bg-success" : "animate-pulse bg-warning")} />
              {cameraReady ? "Aktif" : "Menyiapkan"}
            </span>
          </div>

          <div className="p-5">
            {isCheckIn ? (
              <div className="mb-5">
                <p className="mb-2 text-xs font-medium text-muted">Jenis presensi</p>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-2">
                  {CHECK_IN_OPTIONS.map((o) => {
                    const sel = checkInStatus === o.value;
                    return (
                      <button key={o.value} type="button" onClick={() => { setCheckInStatus(o.value); setSickFile(null); setErrorMessage(""); }}
                        className={cn("flex flex-col items-start gap-0.5 rounded-lg border px-3.5 py-2.5 text-left transition-colors", sel ? "border-primary/40 bg-primary-weak" : "border-line bg-surface hover:bg-surface-2")}>
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className={cn("text-sm font-semibold", sel ? "text-primary" : "text-ink")}>{o.label}</span>
                          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", sel ? "bg-primary text-on-primary" : "bg-surface-2 text-ink-2")}>{o.short}</span>
                        </div>
                        <span className="text-[11px] text-ink-2">{o.helper}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mx-auto w-full max-w-[360px]">
              {needsSelfie ? <div className="mb-2 rounded-lg border border-warning/30 bg-warning-weak px-3 py-2 text-[12px] text-warning">Arahkan kamera separuh badan sampai terlihat bajunya.</div> : null}
              <div className="overflow-hidden rounded-xl border border-line bg-black">
                {isCheckIn && !needsSelfie ? (
                  <div className="flex aspect-[4/5] items-center justify-center bg-surface-2 px-5 text-center text-[13px] text-ink-2">Untuk {checkInStatus === "sakit" ? "sakit + surat, upload bukti" : checkInStatus === "sakit_tanpa_surat" ? "sakit tanpa surat, isi keterangan" : "izin/off, isi keterangan"}. Selfie tidak wajib.</div>
                ) : isCheckOutBlocked ? (
                  <div className="flex aspect-[4/5] items-center justify-center bg-surface-2 px-5 text-center text-[13px] text-ink-2">Presensi pulang dinonaktifkan untuk status izin/sakit.</div>
                ) : !photoDataUrl ? (
                  <video ref={videoRef} autoPlay playsInline muted style={{ filter: filter.css }} className="aspect-[4/5] w-full -scale-x-100 bg-black object-cover" />
                ) : (
                  <div className="relative">
                    <img src={photoDataUrl} alt="Selfie presensi" className="aspect-[4/5] w-full object-cover" />
                    <button type="button" onClick={() => setPhotoDataUrl("")} aria-label="Ambil ulang" className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75"><RotateCcw className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </div>

            {needsSelfie && !isCheckOutBlocked && !photoDataUrl ? (
              <div className="mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-3 pb-1">
                  {FILTERS.map((f) => (
                    <button key={f.id} type="button" onClick={() => setFilter(f)} className="flex flex-none flex-col items-center gap-1.5">
                      <span className={cn("h-11 w-11 overflow-hidden rounded-lg border-2", filter.id === f.id ? "border-primary" : "border-transparent")}>
                        <span className="block h-full w-full" style={{ background: "linear-gradient(135deg,#f5c8a0,#a8d5c8 45%,#c8a8e8)", filter: f.css }} />
                      </span>
                      <span className={cn("text-[9px] font-medium", filter.id === f.id ? "text-primary" : "text-ink-2")}>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              {needsSelfie && !isCheckOutBlocked ? (
                <button type="button" onClick={captureSelfie} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-on-primary hover:bg-primary-strong">
                  <Camera className="h-4 w-4" /> {photoDataUrl ? "Ambil Ulang" : "Ambil Selfie"}
                </button>
              ) : null}
              <button type="button" onClick={submit} disabled={isPending || isCheckOutBlocked} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-5 text-sm font-medium text-ink hover:bg-surface-2 disabled:opacity-60">
                {isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Send className="h-4 w-4" />}
                {isPending ? "Menyimpan…" : isCheckIn ? "Kirim Presensi Masuk" : "Kirim Presensi Pulang"}
              </button>
            </div>

            {/* Early-leave (check-out) */}
            {!isCheckIn && (isEarlyLeaveNow || showApprovalFields) ? (
              <ApprovalBox tone="warning" title="Kamu pulang lebih awal. Wajib isi keterangan." note={earlyLeaveNote} setNote={setEarlyLeaveNote} noteLabel="Keterangan pulang awal" approvers={approvers} approver={assignedApprover} setApprover={setAssignedApprover} />
            ) : null}
            {/* Late (check-in) */}
            {isCheckIn && showApprovalFields ? (
              <ApprovalBox tone="info" title="Kamu datang terlambat. Isi keterangan & pilih atasan." note={approvalNote} setNote={setApprovalNote} noteLabel="Keterangan keterlambatan" approvers={approvers} approver={assignedApprover} setApprover={setAssignedApprover} />
            ) : null}

            {/* Sick / note */}
            {isCheckIn && (needsSickProof || showsNote) ? (
              <div className="mt-5 space-y-4 rounded-xl border border-line bg-surface-2 p-4">
                {needsSickProof ? (
                  <div>
                    <p className="text-sm font-medium text-ink">Upload bukti sakit</p>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(e) => setSickFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:text-on-primary" />
                  </div>
                ) : null}
                {showsNote ? (
                  <div>
                    <p className="text-sm font-medium text-ink">Keterangan</p>
                    <textarea value={sickNote} onChange={(e) => setSickNote(e.target.value)} rows={3} placeholder={checkInStatus === "izin" ? "Contoh: izin keperluan keluarga / off." : "Contoh: demam, istirahat di rumah."} className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-primary" />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {/* Info column */}
        <section className="space-y-4">
          <Panel label="Status hari ini">
            <div className="grid grid-cols-3 gap-2">
              {[["Tanggal", todayAttendance?.tanggal], ["Masuk", todayAttendance?.jamMasuk], ["Pulang", todayAttendance?.jamPulang]].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-surface-2 px-3 py-2">
                  <p className="text-[10px] text-ink-2">{k}</p>
                  <p className="nums mt-0.5 text-[13px] font-semibold text-ink">{v || "-"}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel label="Izin device" action={<button type="button" onClick={() => startLocationTracking(true)} className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-surface-2"><RefreshCw className={cn("h-3 w-3", isLocating && "animate-spin")} /> {isLocating ? "Mencari…" : "Refresh"}</button>}>
            <div className="space-y-2">
              <DeviceRow ok={cameraReady} icon={<Camera className="h-4 w-4" />} label="Kamera" value={cameraReady ? "Diizinkan" : "Menunggu izin"} />
              <DeviceRow ok={locationReady} icon={<MapPin className="h-4 w-4" />} label="Lokasi" value={locationReady ? "Diizinkan" : isLocating ? "Sedang mencari…" : locationPromptActive ? "Meminta izin…" : "Belum diizinkan"} badge={locationAccuracy ? `~${Math.round(locationAccuracy)} m` : undefined} />
              {location ? <div className="rounded-lg bg-surface-2 px-3 py-2 text-[11px] nums text-ink-2">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</div> : null}
              {locationAccuracy !== null && locationAccuracy > 100 ? (
                <div className="rounded-lg border border-warning/40 bg-warning-weak px-3 py-2 text-[11px] leading-relaxed text-warning">
                  Akurasi GPS rendah (~{Math.round(locationAccuracy)} m) — titik lokasi bisa meleset jauh. Aktifkan GPS / &quot;Lokasi presisi tinggi&quot;, keluar ruangan, lalu tekan Refresh sampai akurasi &lt; 50 m.
                </div>
              ) : null}
            </div>
            {locationMessage ? <p className="mt-3 text-[11px] text-ink-2">{locationMessage}</p> : null}
          </Panel>

          <div className="overflow-hidden rounded-xl border border-line bg-surface" style={{ boxShadow: "var(--shadow-sm)" }}>
            <div className="flex items-center justify-between px-5 pt-4">
              <p className="text-xs font-medium text-muted">Lokasi saat ini</p>
              {location ? <a href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-primary hover:underline">Buka Maps</a> : null}
            </div>
            <div className="mt-3 bg-surface-2">
              {mapUrl ? <iframe title="Peta lokasi" src={mapUrl} className="block h-[220px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="flex h-[220px] items-center justify-center px-6 text-center text-[13px] text-ink-2">Menunggu izin lokasi untuk menampilkan peta.</div>}
            </div>
          </div>

          <Panel label="Karyawan">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-weak text-primary"><User className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{employeeName}</p>
                <p className="truncate text-[11px] text-ink-2">{employeeMeta}</p>
              </div>
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}

function Panel({ label, action, children }: { label: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs font-medium text-muted">{label}</p>{action}</div>
      {children}
    </div>
  );
}

function DeviceRow({ ok, icon, label, value, badge }: { ok: boolean; icon: React.ReactNode; label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-2 px-3 py-2.5">
      <span className={cn("flex h-8 w-8 flex-none items-center justify-center rounded-lg", ok ? "bg-success-weak text-success" : "bg-warning-weak text-warning")}>{icon}</span>
      <div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-ink">{label}</p><p className="text-[11px] text-ink-2">{value}</p></div>
      {badge ? <span className="nums rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-ink-2">{badge}</span> : null}
    </div>
  );
}

function ApprovalBox({ tone, title, note, setNote, noteLabel, approvers, approver, setApprover }: { tone: "warning" | "info"; title: string; note: string; setNote: (v: string) => void; noteLabel: string; approvers: ApproverOption[]; approver: string; setApprover: (v: string) => void }) {
  const toneCls = tone === "warning" ? "border-warning/30 bg-warning-weak" : "border-info/30 bg-info-weak";
  return (
    <div className={cn("mt-5 space-y-4 rounded-xl border p-4", toneCls)}>
      <p className="text-[13px] text-ink">{title}</p>
      <div>
        <p className="text-sm font-medium text-ink">{noteLabel}</p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-primary" />
      </div>
      {approvers.length > 0 ? (
        <div>
          <p className="text-sm font-medium text-ink">Atasan tujuan approval</p>
          <select value={approver} onChange={(e) => setApprover(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink focus:border-primary">
            <option value="">Pilih atasan tujuan…</option>
            {approvers.map((a) => <option key={a.userId} value={String(a.userId)}>{a.name} — {a.role}</option>)}
          </select>
          <p className="mt-1 text-[11px] text-ink-2">Kehadiran dihitung setelah disetujui atasan.</p>
        </div>
      ) : null}
    </div>
  );
}

function Popup({ title, body, children, onClose }: { title: string; body: string; children?: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-line bg-surface" style={{ boxShadow: "var(--shadow-lg)" }}>
        <div className="border-b border-line px-5 py-4"><h4 className="text-base font-semibold text-ink">{title}</h4><p className="mt-1 text-sm text-ink-2">{body}</p></div>
        {children ? <div className="px-5 py-4">{children}</div> : null}
        <div className="flex justify-end border-t border-line px-5 py-3"><button type="button" onClick={onClose} className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-on-primary hover:bg-primary-strong">Mengerti</button></div>
      </div>
    </div>
  );
}
