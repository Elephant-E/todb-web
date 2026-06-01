"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { Modal } from "@/components/Modal";
import ToggleSwitch from "@/components/ToggleSwitch";
import api from "@/lib/api";

interface AddPersonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (personId: number) => void;
}

import { mInput as inputCls, mLabel as labelCls, mBtn } from "@/lib/modal-styles";

export function AddPersonModal({ open, onClose, onSuccess }: AddPersonModalProps) {
  const { locale } = useLocale();
  const zh = locale === "zh";
  const label = (zhText: string, enText: string) => zh ? zhText : enText;

  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [biography, setBiography] = useState("");
  const [birthday, setBirthday] = useState("");
  const [deathday, setDeathday] = useState("");
  const [gender, setGender] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [homepage, setHomepage] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) { setName(""); setOriginalName(""); setBiography(""); setBirthday(""); setDeathday(""); setGender(""); setBirthplace(""); setHomepage(""); setIsVirtual(false); setIsAdult(false); setError(""); setSubmitting(false); }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(zh ? "请填写姓名" : "Name is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await api.person.createOrUpdate({
        name: name.trim(),
        original_name: originalName.trim() || undefined,
        biography: biography.trim() || undefined,
        birthday: birthday || undefined,
        deathday: deathday || undefined,
        gender: gender.trim() || undefined,
        birthplace: birthplace.trim() || undefined,
        homepage: homepage.trim() || undefined,
        is_virtual: isVirtual ? 1 : 0,
        is_adult: isAdult,
      });
      if (res.data.person_id && res.data.person_id > 0) {
        onSuccess(res.data.person_id);
        onClose();
      } else {
        setError(zh ? "无权限添加人物" : "No permission to add person");
      }
    } catch {
      setError(zh ? "添加失败，请重试" : "Failed to add, please retry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={label("添加人物", "Add Person")} width="w-[560px]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelCls}>{label("姓名", "Name")} <span className="text-white/30">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} className={inputCls} placeholder={label("人物姓名", "Person name")} required />
        </div>

        <div>
          <label className={labelCls}>{label("原名", "Original Name")}</label>
          <input type="text" value={originalName} onChange={(e) => setOriginalName(e.target.value)} maxLength={200} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>{label("简介", "Biography")}</label>
          <textarea value={biography} onChange={(e) => setBiography(e.target.value)} maxLength={2000} rows={3} className={`${inputCls} resize-none`} placeholder={label("人物简介", "Person biography")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{label("出生日期", "Birthday")}</label>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{label("逝世日期", "Deathday")}</label>
            <input type="date" value={deathday} onChange={(e) => setDeathday(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{label("性别", "Gender")}</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputCls} appearance-none`}>
              <option value="" className="bg-[#1a1a1a] text-white">{label("未知", "Unknown")}</option>
              <option value="male" className="bg-[#1a1a1a] text-white">{label("男", "Male")}</option>
              <option value="female" className="bg-[#1a1a1a] text-white">{label("女", "Female")}</option>
              <option value="other" className="bg-[#1a1a1a] text-white">{label("其他", "Other")}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{label("出生地", "Birthplace")}</label>
            <input type="text" value={birthplace} onChange={(e) => setBirthplace(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>{label("主页", "Homepage")}</label>
          <input type="url" value={homepage} onChange={(e) => setHomepage(e.target.value)} className={inputCls} placeholder="https://" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{label("虚拟人物", "Virtual")}</label>
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 border border-white/[0.08]">
              <span className="text-sm text-white/70">{isVirtual ? (zh ? "是" : "Yes") : (zh ? "否" : "No")}</span>
              <ToggleSwitch checked={isVirtual} onChange={() => setIsVirtual(!isVirtual)} />
            </div>
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
