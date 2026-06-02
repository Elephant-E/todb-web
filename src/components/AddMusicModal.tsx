"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Loader2, Music, Disc3, X, Search, ImageIcon } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { Modal } from "@/components/Modal";
import ToggleSwitch from "@/components/ToggleSwitch";
import { profileUrl } from "@/lib/utils";
import api from "@/lib/api";
import type { PersonListItem } from "@/types";

interface AddMusicModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (id: number, type: "song" | "album") => void;
}

import { mInput as inputCls, mLabel as labelCls, mBtn } from "@/lib/modal-styles";

export function AddMusicModal({ open, onClose, onSuccess }: AddMusicModalProps) {
  const { locale } = useLocale();
  const zh = locale === "zh";
  const lbl = (z: string, e: string) => zh ? z : e;
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"song" | "album">("song");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isrc, setIsrc] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [durationSec, setDurationSec] = useState("");
  const [upc, setUpc] = useState("");
  const [releaseCompany, setReleaseCompany] = useState("");
  const [albumType, setAlbumType] = useState("single");
  const [isAdult, setIsAdult] = useState(false);
  const [imagePoster, setImagePoster] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [selectedArtists, setSelectedArtists] = useState<PersonListItem[]>([]);
  const [artistSearch, setArtistSearch] = useState("");
  const [searchResults, setSearchResults] = useState<PersonListItem[]>([]);
  const [searching, setSearching] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setName(""); setDescription(""); setTagline(""); setReleaseDate("");
    setIsrc(""); setDurationMin(""); setDurationSec(""); setUpc(""); setReleaseCompany("");
    setAlbumType("single"); setIsAdult(false); setError("");
    setImagePoster(null); setImagePreview(null); setUploading(false);
    setSelectedArtists([]); setArtistSearch(""); setSearchResults([]);
  };

  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(reset, 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  const handleModeChange = (m: "song" | "album") => {
    setMode(m);
    reset();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      const res = await api.image.upload(file);
      setImagePoster(res.data.image_path);
    } catch {
      setError(zh ? "图片上传失败" : "Image upload failed");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleArtistSearch = (value: string) => {
    setArtistSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!value.trim()) { setSearchResults([]); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await api.person.query({ name: value.trim() });
        setSearchResults(res.data.items || []);
      } catch { setSearchResults([]); } finally { setSearching(false); }
    }, 300);
  };

  const handleSelectArtist = (person: PersonListItem) => {
    if (!selectedArtists.find((a) => a.person_id === person.person_id)) {
      setSelectedArtists([...selectedArtists, person]);
    }
    setArtistSearch(""); setSearchResults([]);
  };

  const handleRemoveArtist = (personId: number) => {
    setSelectedArtists(selectedArtists.filter((a) => a.person_id !== personId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError(zh ? "请填写名称" : "Name is required"); return; }
    if (selectedArtists.length === 0) { setError(zh ? "请选择至少一位歌手" : "At least one artist is required"); return; }
    setSubmitting(true);
    setError("");
    try {
      const artistIds = selectedArtists.map((a) => a.person_id);
      if (mode === "song") {
        const data = {
          name: name.trim(),
          description: description.trim() || undefined,
          tagline: tagline.trim() || undefined,
          release_date: releaseDate || "1970-01-01",
          isrc: isrc.trim() || undefined,
          duration: (Number(durationMin) * 60 + Number(durationSec)) * 1000 || undefined,
          is_adult: isAdult,
          image_poster: imagePoster || undefined,
          person_id_artists: artistIds,
        };
        const res = await api.music.song.createOrUpdate(data);
        if (res.data.song_id && res.data.song_id > 0) { onSuccess(res.data.song_id, "song"); onClose(); reset(); }
        else { setError(zh ? "无权限添加" : "No permission"); }
      } else {
        const data = {
          name: name.trim(),
          description: description.trim() || undefined,
          tagline: tagline.trim() || undefined,
          release_date: releaseDate || "1970-01-01",
          upc: upc.trim() || undefined,
          release_company: releaseCompany.trim() || undefined,
          type: albumType,
          is_adult: isAdult,
          image_poster: imagePoster || undefined,
          person_id_artists: artistIds,
        };
        const res = await api.music.album.createOrUpdate(data);
        if (res.data.album_id && res.data.album_id > 0) { onSuccess(res.data.album_id, "album"); onClose(); reset(); }
        else { setError(zh ? "无权限添加" : "No permission"); }
      }
    } catch { setError(zh ? "添加失败，请重试" : "Failed to add, please retry"); } finally { setSubmitting(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title={lbl("添加音乐", "Add Music")} width="w-[560px]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelCls}>{lbl("类型", "Type")}</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => handleModeChange("song")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === "song" ? "bg-white text-[#111]" : "bg-white/10 text-white/70 hover:text-white"}`}>
              <Music size={14} /> {lbl("歌曲", "Song")}
            </button>
            <button type="button" onClick={() => handleModeChange("album")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === "album" ? "bg-white text-[#111]" : "bg-white/10 text-white/70 hover:text-white"}`}>
              <Disc3 size={14} /> {lbl("专辑", "Album")}
            </button>
          </div>
        </div>

        <div>
          <label className={labelCls}>{lbl("名称", "Name")} <span className="text-white/30">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className={inputCls} placeholder={mode === "song" ? lbl("歌曲名", "Song name") : lbl("专辑名", "Album name")} required />
        </div>

        <div>
          <label className={labelCls}>{lbl("歌手", "Artist")} <span className="text-white/30">*</span></label>
          {selectedArtists.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedArtists.map((a) => (
                <span key={a.person_id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white">
                  {a.name}
                  <button type="button" onClick={() => handleRemoveArtist(a.person_id)} className="text-white/40 hover:text-red-400 transition-colors"><X size={10} /></button>
                </span>
              ))}
            </div>
          )}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-4 text-white/30 pointer-events-none" />
            <input ref={inputRef} type="text" value={artistSearch} onChange={(e) => handleArtistSearch(e.target.value)} className={`${inputCls} pl-10`} placeholder={lbl("输入姓名搜索歌手...", "Search artist by name...")} autoComplete="off" />
          </div>
          {artistSearch.trim() && (
            <div className="mt-2 rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
              {searching ? (
                <div className="px-3 py-3 text-xs text-white/30 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> {lbl("搜索中...", "Searching...")}</div>
              ) : searchResults.length > 0 ? searchResults.map((p) => {
                const avatar = profileUrl(p.image_profile, "w185");
                const alreadySelected = selectedArtists.find((a) => a.person_id === p.person_id);
                return (
                  <button key={p.person_id} type="button" onClick={() => handleSelectArtist(p)} disabled={!!alreadySelected} className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left transition-colors border-b border-white/[0.04] last:border-0 ${alreadySelected ? "text-white/30 cursor-default" : "text-white/70 hover:text-white hover:bg-white/[0.06]"}`}>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0">{avatar ? <Image src={avatar} alt="" fill sizes="32px" unoptimized className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-medium">{p.name[0]}</div>}</div>
                    <div className="flex-1 min-w-0">
                      <span className="truncate text-white/80">{p.name}</span>
                      {p.original_name && <span className="text-white/30 text-xs ml-2 truncate">({p.original_name})</span>}
                    </div>
                    {alreadySelected && <span className="text-white/20 text-xs">{lbl("已选", "Selected")}</span>}
                  </button>
                );
              }) : (
                <div className="px-3 py-3 text-xs text-white/30">{lbl("无搜索结果", "No results found")}</div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>{lbl("简介", "Description")}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={2} className={`${inputCls} resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{lbl("标语", "Tagline")}</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={100} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{lbl("发行日期", "Release Date")}</label>
            <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className={inputCls} />
          </div>
        </div>

        {mode === "song" ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>ISRC</label>
              <input type="text" value={isrc} onChange={(e) => setIsrc(e.target.value)} maxLength={12} className={inputCls} placeholder="TWU712601303" />
            </div>
            <div>
              <label className={labelCls}>{lbl("时长", "Duration")}</label>
              <div className="flex gap-2">
                <input type="text" inputMode="numeric" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} className={`${inputCls} flex-1`} placeholder={lbl("分", "Min")} />
                <span className="text-white/40 self-center">:</span>
                <input type="text" inputMode="numeric" value={durationSec} onChange={(e) => setDurationSec(e.target.value)} className={`${inputCls} flex-1`} placeholder={lbl("秒", "Sec")} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>UPC</label>
              <input type="text" value={upc} onChange={(e) => setUpc(e.target.value)} maxLength={13} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{lbl("类型", "Album Type")}</label>
              <select value={albumType} onChange={(e) => setAlbumType(e.target.value)} className={`${inputCls} appearance-none`}>
                <option value="single" className="bg-[#1a1a1a] text-white">Single</option>
                <option value="album" className="bg-[#1a1a1a] text-white">Album</option>
                <option value="ep" className="bg-[#1a1a1a] text-white">EP</option>
                <option value="compilation" className="bg-[#1a1a1a] text-white">Compilation</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>{lbl("发行公司", "Release Co.")}</label>
              <input type="text" value={releaseCompany} onChange={(e) => setReleaseCompany(e.target.value)} className={inputCls} />
            </div>
          </div>
        )}

        <div>
          <label className={labelCls}>{lbl("封面图", "Cover Image")}</label>
          {imagePreview ? (
            <div className="relative group rounded-xl overflow-hidden border border-white/[0.08]">
              {/* eslint-disable-next-line @next/next/no-img-element -- blob: preview URLs are not suitable for next/image */}
              <img src={imagePreview} alt="" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 rounded-lg text-xs font-medium bg-white text-[#111] hover:opacity-90 transition-all">
                  {uploading ? <Loader2 size={12} className="animate-spin" /> : lbl("更换", "Change")}
                </button>
                <button type="button" onClick={() => { setImagePoster(null); setImagePreview(null); }} className="px-4 py-2 rounded-lg text-xs font-medium bg-white/10 text-white/70 hover:text-white transition-all">
                  {lbl("移除", "Remove")}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full h-32 rounded-xl bg-white/[0.04] border border-dashed border-white/[0.12] hover:border-white/20 hover:bg-white/[0.06] transition-all flex flex-col items-center justify-center gap-2">
              {uploading ? <Loader2 size={20} className="text-white/30 animate-spin" /> : <ImageIcon size={20} className="text-white/20" />}
              <span className="text-xs text-white/30">{uploading ? (zh ? "上传中..." : "Uploading...") : lbl("点击上传封面图", "Click to upload cover")}</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        <div>
          <label className={labelCls}>18+</label>
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 border border-white/[0.08]">
            <span className="text-sm text-white/70">{isAdult ? (zh ? "是" : "Yes") : (zh ? "否" : "No")}</span>
            <ToggleSwitch checked={isAdult} onChange={() => setIsAdult(!isAdult)} />
          </div>
        </div>

        {error && <p className="text-xs text-white bg-white/10 px-4 py-2.5 rounded-xl border border-white/[0.08]">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{lbl("取消", "Cancel")}</button>
          <button type="submit" disabled={submitting || uploading} className={`${mBtn} bg-white text-[#111] hover:opacity-90 disabled:opacity-50`}>{submitting ? <Loader2 size={14} className="animate-spin" /> : lbl("添加", "Add")}</button>
        </div>
      </form>
    </Modal>
  );
}
