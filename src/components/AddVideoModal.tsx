"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { Modal } from "@/components/Modal";
import ToggleSwitch from "@/components/ToggleSwitch";
import api from "@/lib/api";
import type { VideoCreateOrUpdateParams } from "@/types";

import { mInput as inputCls, mLabel as labelCls, mBtn } from "@/lib/modal-styles";
import { STATUS_MAP } from "@/lib/utils";

const STATUS_OPTIONS: { value: VideoCreateOrUpdateParams["status"]; zh: string; en: string }[] = Object.entries(STATUS_MAP).map(([value, { zh, en }]) => ({ value: value as VideoCreateOrUpdateParams["status"], zh, en }));

interface AddVideoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (videoId: number) => void;
}

export function AddVideoModal({ open, onClose, onSuccess }: AddVideoModalProps) {
  const { locale, t: _t } = useLocale();
  const zh = locale === "zh";

  const [videoType, setVideoType] = useState<"tv" | "movie">("movie");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originTitle, setOriginTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [status, setStatus] = useState<VideoCreateOrUpdateParams["status"]>("released");
  const [dateAir, setDateAir] = useState("");
  const [runtimeMin, setRuntimeMin] = useState("");
  const [runtimeSec, setRuntimeSec] = useState("");
  const [originCountrys, setOriginCountrys] = useState("US");
  const [originalLanguages, setOriginalLanguages] = useState("en");
  const [isAdult, setIsAdult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setOriginCountrys(zh ? "CN" : "US");
      setOriginalLanguages(zh ? "zh" : "en");
    } else {
      setVideoType("movie"); setTitle(""); setDescription(""); setOriginTitle(""); setTagline(""); setStatus("released"); setDateAir(""); setRuntimeMin(""); setRuntimeSec(""); setIsAdult(false); setError(""); setSubmitting(false);
    }
  }, [open, zh]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateAir) {
      setError(zh ? "请填写标题和日期" : "Title and date are required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await api.video.createOrUpdate({
        video_type: videoType,
        video_title: title.trim(),
        video_description: description.trim(),
        origin_title: originTitle.trim() || null,
        tagline: tagline.trim(),
        status,
        date_air: dateAir,
        runtime: (Number(runtimeMin) + Number(runtimeSec) / 60) || null,
        origin_countrys: originCountrys.split(",").map((s) => s.trim()).filter(Boolean),
        original_languages: originalLanguages.split(",").map((s) => s.trim()).filter(Boolean),
        is_adult: isAdult,
      });
      if (res.data.video_id && res.data.video_id > 0) {
        onSuccess(res.data.video_id);
        onClose();
      } else {
        setError(zh ? "无权限添加影视" : "No permission to add video");
      }
    } catch {
      setError(zh ? "添加失败，请重试" : "Failed to add, please retry");
    } finally {
      setSubmitting(false);
    }
  };

  const label = (zhText: string, enText: string) => zh ? zhText : enText;

  return (
    <Modal open={open} onClose={onClose} title={label("添加影视", "Add Video")} width="w-[560px]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelCls}>{label("类型", "Type")}</label>
          <div className="flex gap-2">
            {(["movie", "tv"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setVideoType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  videoType === type
                    ? "bg-white text-[#111]"
                    : "bg-white/10 text-white/70 hover:text-white border border-white/[0.08]"
                }`}
              >
                {type === "movie" ? label("电影", "Movie") : label("电视", "TV")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>{label("标题", "Title")} <span className="text-white/30">*</span></label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className={inputCls} placeholder={label("影视标题", "Video title")} required />
        </div>

        <div>
          <label className={labelCls}>{label("简介", "Description")}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} className={`${inputCls} resize-none`} placeholder={label("影视简介", "Video description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{label("原名", "Original Title")}</label>
            <input type="text" value={originTitle} onChange={(e) => setOriginTitle(e.target.value)} maxLength={200} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{label("标语", "Tagline")}</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={100} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{label("状态", "Status")} <span className="text-white/30">*</span></label>
            <select value={status} onChange={(e) => setStatus(e.target.value as VideoCreateOrUpdateParams["status"])} className={`${inputCls} appearance-none`}>
              {STATUS_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value} className="bg-[#1a1a1a] text-white">{zh ? opt.zh : opt.en}</option>))}
            </select>
          </div>
          <div>
            <label className={labelCls}>{label("上映日期", "Air Date")} <span className="text-white/30">*</span></label>
            <input type="date" value={dateAir} onChange={(e) => setDateAir(e.target.value)} className={inputCls} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{label("时长", "Runtime")}</label>
            <div className="flex gap-2 items-center">
              <input type="text" inputMode="numeric" value={runtimeMin} onChange={(e) => setRuntimeMin(e.target.value)} className={`${inputCls} flex-1 disabled:opacity-40`} disabled={videoType === "tv"} placeholder={label("分", "Min")} />
              <span className="text-white/40">:</span>
              <input type="text" inputMode="numeric" value={runtimeSec} onChange={(e) => setRuntimeSec(e.target.value)} className={`${inputCls} flex-1 disabled:opacity-40`} disabled={videoType === "tv"} placeholder={label("秒", "Sec")} />
            </div>
          </div>
          <div>
            <label className={labelCls}>{label("国家 / 地区", "Country / Region")}</label>
            <input type="text" value={originCountrys} onChange={(e) => setOriginCountrys(e.target.value)} className={inputCls} placeholder={zh ? "如：中国、美国" : "e.g. US, CN"} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{label("语言", "Language")}</label>
            <input type="text" value={originalLanguages} onChange={(e) => setOriginalLanguages(e.target.value)} className={inputCls} placeholder={zh ? "如：中文、英语" : "e.g. en, zh"} />
          </div>
          <div>
            <label className={labelCls}>18+</label>
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 border border-white/[0.08]">
              <span className="text-sm text-white/70">{isAdult ? (zh ? "是" : "Yes") : (zh ? "否" : "No")}</span>
              <ToggleSwitch checked={isAdult} onChange={() => setIsAdult(!isAdult)} />
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-white bg-white/10 px-4 py-2.5 rounded-xl border border-white/[0.08]">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{label("取消", "Cancel")}</button>
          <button type="submit" disabled={submitting} className={`${mBtn} bg-white text-[#111] hover:opacity-90 disabled:opacity-50`}>{submitting ? <Loader2 size={14} className="animate-spin" /> : label("添加", "Add")}</button>
        </div>
      </form>
    </Modal>
  );
}
