"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Globe, ExternalLink,
  Loader2, MapPin, Users, Pencil, Trash2,
} from "lucide-react";
import { profileUrl, backdropUrl, formatDate } from "@/lib/utils";
import { useLocale } from "@/components/LocaleProvider";
import { useDetailColors } from "@/lib/useDetailColors";
import DetailHero from "@/components/DetailHero";
import { Modal } from "@/components/Modal";
import ToggleSwitch from "@/components/ToggleSwitch";
import api from "@/lib/api";
import { mInput, mLabel, mBtn } from "@/lib/modal-styles";
import type { PersonDetail, ExternalId } from "@/types";


const ZH = {
  back: "返回", biography: "简介", born: "出生", died: "逝世", birthplace: "出生地",
  externalLinks: "外部链接", alsoKnownAs: "又名", editPerson: "编辑人物",
  name: "姓名", originalName: "原名", birthday: "出生日期", deathday: "逝世日期",
  gender: "性别", homepage: "主页", isVirtual: "虚拟人物", isAdult: "成人",
  save: "保存", cancel: "取消", deletePerson: "删除人物",
  confirmDelete: "确定要删除此人物吗？此操作不可撤销。", deleting: "删除中…",
};
const EN = {
  back: "Back", biography: "Biography", born: "Born", died: "Died", birthplace: "Birthplace",
  externalLinks: "External Links", alsoKnownAs: "Also Known As", editPerson: "Edit Person",
  name: "Name", originalName: "Original Name", birthday: "Birthday", deathday: "Deathday",
  gender: "Gender", homepage: "Homepage", isVirtual: "Virtual", isAdult: "Adult",
  save: "Save", cancel: "Cancel", deletePerson: "Delete Person",
  confirmDelete: "Are you sure you want to delete this person? This action cannot be undone.", deleting: "Deleting…",
};

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useLocale();
  const personId = Number(id);
  const l = locale === "zh" ? ZH : EN;

  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [editName, setEditName] = useState("");
  const [editOriginalName, setEditOriginalName] = useState("");
  const [editBiography, setEditBiography] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [editDeathday, setEditDeathday] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editBirthplace, setEditBirthplace] = useState("");
  const [editHomepage, setEditHomepage] = useState("");
  const [editIsVirtual, setEditIsVirtual] = useState(false);
  const [editIsAdult, setEditIsAdult] = useState(false);

  const isValidId = !isNaN(personId) && personId > 0;

  const fetchDetail = async () => {
    try {
      const res = await api.person.info(personId);
      setDetail(res.data);
    } catch { setError(true); }
  };

  useEffect(() => {
    if (!isValidId) { setLoading(false); setError(true); return; }
    (async () => { await fetchDetail(); setLoading(false); })();
  }, [isValidId, personId]);

  useEffect(() => {
    if (showEditModal && detail) {
      setEditName(detail.name);
      setEditOriginalName(detail.original_name || "");
      setEditBiography(detail.biography || "");
      setEditBirthday(detail.birthday || "");
      setEditDeathday(detail.deathday || "");
      setEditGender(detail.gender || "");
      setEditBirthplace(detail.birthplace || "");
      setEditHomepage(detail.homepage || "");
      setEditIsVirtual(!!detail.is_virtual);
      setEditIsAdult(detail.is_adult);
      setEditError("");
    }
  }, [showEditModal, detail]);

  const handleSave = async () => {
    if (!editName.trim()) { setEditError(locale === "zh" ? "姓名不能为空" : "Name is required"); return; }
    setSaving(true);
    setEditError("");
    try {
      await api.person.createOrUpdate({
        name: editName.trim(),
        original_name: editOriginalName.trim() || undefined,
        biography: editBiography.trim() || undefined,
        birthday: editBirthday || undefined,
        deathday: editDeathday || undefined,
        gender: editGender || undefined,
        birthplace: editBirthplace.trim() || undefined,
        homepage: editHomepage.trim() || undefined,
        is_virtual: editIsVirtual ? 1 : 0,
        is_adult: editIsAdult,
      });
      setShowEditModal(false);
      await fetchDetail();
    } catch { setEditError(locale === "zh" ? "保存失败" : "Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.person.delete(personId);
      router.push("/people");
    } catch { setDeleting(false); }
  };

  const bd = backdropUrl(detail?.image_backdrop ?? null);
  const c = useDetailColors(!!bd);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="text-text-tertiary animate-spin" /></div>;
  if (error || !detail) return <div className="min-h-screen flex flex-col items-center justify-center text-text-tertiary"><Users size={48} className="mb-4" /><p className="text-lg mb-4">{locale === "zh" ? "人物未找到" : "Person not found"}</p><Link href="/people" className="text-text-secondary hover:text-text-primary text-sm underline">{locale === "zh" ? "浏览人物" : "Browse people"}</Link></div>;

  const avatar = profileUrl(detail.image_profile, "w185");
  const externalIds: ExternalId[] = detail.external_ids ?? [];
  const displayName = locale === "en" && detail.original_name ? detail.original_name : detail.name;
  const canEdit = detail.is_can_edit ?? true;



  return (
    <div className="min-h-screen bg-bg-primary">
      <DetailHero
        backdropUrl={bd}
        onBack={() => router.back()}
        backLabel={l.back}
        posterSlot={
          avatar ? <img src={avatar} alt={detail.name} className={`w-[200px] md:w-[260px] aspect-square rounded-2xl shadow-elevated object-cover ${c.posterB}`} /> : <div className={`w-[200px] md:w-[260px] aspect-square rounded-2xl ${c.posterBg} ${c.posterB} flex items-center justify-center`}><Users size={48} className={c.posterIc} /></div>
        }
        infoSlot={<>
          <div className="pt-0 md:pt-3">
            <div className="flex items-end gap-3 mb-2">
              <h1 className={`text-3xl md:text-5xl font-bold tracking-tight ${c.h1}`}>{displayName}</h1>
              {canEdit && <div className="flex items-end gap-1">
                <button onClick={() => setShowEditModal(true)} className={`p-1.5 rounded-lg transition-all ${c.icon}`} title={l.editPerson}><Pencil size={14} /></button>
                <button onClick={() => setShowDeleteModal(true)} className={`p-1.5 rounded-lg transition-all text-red-400/40 hover:text-red-400`} title={l.deletePerson}><Trash2 size={14} /></button>
              </div>}
            </div>
            {detail.original_name && detail.original_name !== displayName && <p className={`text-lg mb-2 ${c.sub}`}>{detail.original_name}</p>}
            {detail.tagline && <p className={`text-sm italic mb-4 ${c.sub}`}>&ldquo;{detail.tagline}&rdquo;</p>}

            <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-4 ${c.meta}`}>
              {detail.birthday && <span className="flex items-center gap-1.5"><Calendar size={14} /> {l.born}: {formatDate(detail.birthday, locale)}</span>}
              {detail.deathday && <span className="flex items-center gap-1.5">{l.died}: {formatDate(detail.deathday, locale)}</span>}
              {detail.birthplace && <span className="flex items-center gap-1.5"><MapPin size={14} /> {detail.birthplace}</span>}
              {detail.homepage && <a href={detail.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"><Globe size={14} /> {locale === "zh" ? "主页" : "Homepage"}</a>}
              {detail.is_adult && <span>18+</span>}
            </div>

            {detail.also_known_as.length > 0 && (<div className="flex flex-wrap gap-2 mb-4">{detail.also_known_as.map((name, i) => (<span key={i} className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${c.tag}`}>{name}</span>))}</div>)}

            {externalIds.length > 0 && (<div className="flex flex-wrap gap-2">{externalIds.map((ext) => {const href = ext.type === "homepage" ? ext.value : ext.type === "tmdb_id_person" ? `https://www.themoviedb.org/person/${ext.value}` : ext.type === "imdb" ? `https://www.imdb.com/name/${ext.value}` : null; return (<a key={ext.type} href={href ?? undefined} target={href ? "_blank" : undefined} rel={href ? "noopener noreferrer" : undefined} className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all ${c.link} ${!href ? "cursor-default" : ""}`}>{ext.type.toUpperCase()}{href && <ExternalLink size={9} />}</a>);})}</div>)}
          </div>
        </>}
      />

      <div className="relative z-10 px-6 pt-4 pb-20"><div className="max-w-[1400px] mx-auto space-y-8">
        {detail.biography && <div><h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-3">{l.biography}</h3><p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{detail.biography}</p></div>}
      </div></div>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title={l.editPerson}>
        <div><label className={mLabel}>{l.name} <span className="text-white/30">*</span></label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={mInput} /></div>
        <div><label className={mLabel}>{l.originalName}</label><input type="text" value={editOriginalName} onChange={(e) => setEditOriginalName(e.target.value)} className={mInput} /></div>
        <div><label className={mLabel}>{l.biography}</label><textarea value={editBiography} onChange={(e) => setEditBiography(e.target.value)} rows={3} className={`${mInput} resize-none`} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={mLabel}>{l.birthday}</label><input type="date" value={editBirthday} onChange={(e) => setEditBirthday(e.target.value)} className={mInput} /></div>
          <div><label className={mLabel}>{l.deathday}</label><input type="date" value={editDeathday} onChange={(e) => setEditDeathday(e.target.value)} className={mInput} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={mLabel}>{l.gender}</label><select value={editGender} onChange={(e) => setEditGender(e.target.value)} className={`${mInput} appearance-none`}><option value="" className="bg-[#1a1a1a] text-white">{locale === "zh" ? "未知" : "Unknown"}</option><option value="male" className="bg-[#1a1a1a] text-white">{locale === "zh" ? "男" : "Male"}</option><option value="female" className="bg-[#1a1a1a] text-white">{locale === "zh" ? "女" : "Female"}</option><option value="other" className="bg-[#1a1a1a] text-white">{locale === "zh" ? "其他" : "Other"}</option></select></div>
          <div><label className={mLabel}>{l.birthplace}</label><input type="text" value={editBirthplace} onChange={(e) => setEditBirthplace(e.target.value)} className={mInput} /></div>
        </div>
        <div><label className={mLabel}>{l.homepage}</label><input type="url" value={editHomepage} onChange={(e) => setEditHomepage(e.target.value)} className={mInput} placeholder="https://" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 border border-white/[0.08]"><span className="text-sm text-white/70">{l.isVirtual}</span><ToggleSwitch checked={editIsVirtual} onChange={() => setEditIsVirtual(!editIsVirtual)} /></div>
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 border border-white/[0.08]"><span className="text-sm text-white/70">18+</span><ToggleSwitch checked={editIsAdult} onChange={() => setEditIsAdult(!editIsAdult)} /></div>
        </div>
        {editError && <p className="text-xs text-white bg-white/10 px-4 py-2.5 rounded-xl border border-white/[0.08]">{editError}</p>}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={() => setShowEditModal(false)} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.cancel}</button>
          <button onClick={handleSave} disabled={saving} className={`${mBtn} bg-white text-[#111] hover:opacity-90 disabled:opacity-50`}>{saving ? <Loader2 size={14} className="animate-spin" /> : l.save}</button>
        </div>
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={l.deletePerson}>
        <p className="text-sm text-white/70">{l.confirmDelete}</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setShowDeleteModal(false)} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.cancel}</button>
          <button onClick={handleDelete} disabled={deleting} className={`${mBtn} bg-red-500 text-white hover:bg-red-600 disabled:opacity-50`}>{deleting ? <Loader2 size={14} className="animate-spin" /> : l.deletePerson}</button>
        </div>
      </Modal>
    </div>
  );
}
