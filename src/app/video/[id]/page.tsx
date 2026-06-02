"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Tv, Film, Star, Clock, Calendar, Globe, ExternalLink,
  Loader2, Layers, Users, Plus, Pencil, RefreshCw, Trash2, Lock, X,
} from "lucide-react";
import { backdropUrl, logoUrl, posterUrl, profileUrl, formatDate, formatRuntime } from "@/lib/utils";
import { useLocale } from "@/components/LocaleProvider";
import { useDetailColors } from "@/lib/useDetailColors";
import DetailHero from "@/components/DetailHero";
import api from "@/lib/api";
import type { VideoDetail, VideoPerson, Season, Episode, Title, Part, Genre, ExternalId, ImageItem } from "@/types";
import AliasModal from "./modals/AliasModal";
import GenreModal from "./modals/GenreModal";
import SyncModal from "./modals/SyncModal";
import DeleteVideoModal from "./modals/DeleteVideoModal";
import SeasonModals from "./modals/SeasonModals";
import EpisodeModals from "./modals/EpisodeModals";

const ZH = {
  back: "返回", aliases: "别名", externalLinks: "外部链接", aliasesCount: "别名", partsCount: "分段",
  votes: "投票", parts: "分段", seasonsEpisodes: "季与集", season: "第 ", seasonSuffix: " 季", allSeasons: "全部季",
  episodes: "集", cast: "演员", crew: "制作", description: "简介", genres: "类型", sync: "同步",
  images: "图片", addAlias: "添加别名", editGenres: "编辑类型", syncTmdb: "同步 TMDB",
  deleteVideo: "删除影视", confirmDelete: "确认删除", deleteWarning: "删除后无法恢复，确认要删除吗？",
  newAlias: "新别名...", tmdbId: "TMDB ID", syncFromTmdb: "从 TMDB 同步", searchTmdb: "搜索 TMDB",
  searchTitle: "搜索标题...", setDefault: "设为默认", delete: "删除", poster: "海报",
  backdrop: "背景", logo: "Logo", profile: "头像", addSeason: "新增季", editSeason: "编辑季", deleteSeason: "删除季", seasonNumber: "季数", seasonTitle: "标题", seasonDesc: "描述", dateAir: "播出日期", editEpisode: "编辑集", deleteEpisode: "删除集", addEpisodes: "新增集", episodeNumber: "集数", episodeTitle: "标题", runtime: "时长", runtimeMin: "分", runtimeSec: "秒", confirmDeleteSeason: "确认删除季？", deleteSeasonWarning: "删除该季及所有集，无法恢复。", confirmDeleteEpisode: "确认删除集？", deleteEpisodeWarning: "删除后无法恢复。", addRow: "添加一行",
};
const EN = {
  back: "Back", aliases: "Aliases", externalLinks: "External Links", aliasesCount: "Aliases", partsCount: "Parts",
  votes: "Votes", parts: "Parts", seasonsEpisodes: "Seasons & Episodes", season: "Season ", seasonSuffix: "", allSeasons: "All Seasons",
  episodes: "episodes", cast: "Cast", crew: "Crew", description: "Description", genres: "Genres", sync: "Sync",
  images: "Images", addAlias: "Add Alias", editGenres: "Edit Genres", syncTmdb: "Sync TMDB",
  deleteVideo: "Delete Video", confirmDelete: "Confirm Delete", deleteWarning: "This action cannot be undone. Are you sure?",
  newAlias: "New alias...", tmdbId: "TMDB ID", syncFromTmdb: "Sync from TMDB", searchTmdb: "Search TMDB",
  searchTitle: "Search title...", setDefault: "Default", delete: "Delete", poster: "Poster",
  backdrop: "Backdrop", logo: "Logo", profile: "Profile", addSeason: "Add Season", editSeason: "Edit Season", deleteSeason: "Delete Season", seasonNumber: "Season #", seasonTitle: "Title", seasonDesc: "Description", dateAir: "Air Date", editEpisode: "Edit Episode", deleteEpisode: "Delete Episode", addEpisodes: "Add Episodes", episodeNumber: "Episode #", episodeTitle: "Title", runtime: "Duration", runtimeMin: "Min", runtimeSec: "Sec", confirmDeleteSeason: "Delete Season?", deleteSeasonWarning: "This will delete the season and all its episodes.", confirmDeleteEpisode: "Delete Episode?", deleteEpisodeWarning: "This action cannot be undone.", addRow: "Add Row",
};

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { locale, t } = useLocale();
  const videoId = Number(id);
  const isValidId = !isNaN(videoId) && videoId > 0;
  const l = locale === "zh" ? ZH : EN;

  const [detail, setDetail] = useState<VideoDetail | null>(null);
  const [titles, setTitles] = useState<Title[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [genreIds, setGenreIds] = useState<number[]>([]);
  const [persons, setPersons] = useState<VideoPerson[]>([]);
  const [loading, setLoading] = useState(isValidId);
  const [error, setError] = useState(!isValidId);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  const [showAliasModal, setShowAliasModal] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [showEditSeasonModal, setShowEditSeasonModal] = useState(false);
  const [editSeason, setEditSeason] = useState<Season | null>(null);
  const [showDeleteSeasonModal, setShowDeleteSeasonModal] = useState(false);
  const [deleteSeasonNum, setDeleteSeasonNum] = useState<number | null>(null);
  const [showEditEpisodeModal, setShowEditEpisodeModal] = useState(false);
  const [editEpisode, setEditEpisode] = useState<Episode | null>(null);
  const [showDeleteEpisodeModal, setShowDeleteEpisodeModal] = useState(false);
  const [deleteEpisodeNum, setDeleteEpisodeNum] = useState<number | null>(null);
  const [showAddEpisodesModal, setShowAddEpisodesModal] = useState(false);

  const refreshImages = useCallback(async () => {
    try { const r = await api.image.list({ relation_type: "video_list", relation_id: videoId, page: 1, page_size: 50 }); setImages(r.data.items); } catch {}
  }, [videoId]);

  useEffect(() => {
    if (!isValidId) return;
    (async () => {
      try {
        const detailRes = await api.video.detail(videoId);
        setDetail(detailRes.data);
        const extra: Promise<void>[] = [];
        extra.push(api.video.titles.list(videoId).then((r) => setTitles(r.data)).catch(() => {}));
        extra.push(api.video.genres.dict(videoId).then((r) => setGenres(r.data)).catch(() => {}));
        extra.push(api.video.part.list(videoId).then((r) => setParts(r.data)).catch(() => {}));
        extra.push(api.video.genres.list(videoId).then((r) => setGenreIds(r.data.genre_ids)).catch(() => {}));
        extra.push(api.image.list({ relation_type: "video_list", relation_id: videoId, page: 1, page_size: 50 }).then((r) => setImages(r.data.items)).catch(() => {}));
        if (detailRes.data.persons) setPersons(detailRes.data.persons);
        if (detailRes.data.video_type === "tv") {
          extra.push(api.video.season.all(videoId).then((r) => { setSeasons(r.data); }).catch(() => {}));
        }
        await Promise.all(extra);
      } catch { setError(true); } finally { setLoading(false); }
    })();
  }, [isValidId, videoId]);

  useEffect(() => {
    if (!isValidId || selectedSeason === null) return;
    (async () => {
      setLoadingEpisodes(true);
      try { const res = await api.video.episode.all(videoId, selectedSeason); setEpisodes(res.data); }
      catch { setEpisodes([]); } finally { setLoadingEpisodes(false); }
    })();
  }, [isValidId, videoId, selectedSeason]);

  const handleDeleteTitle = async (titleId: number) => { try { await api.video.titles.delete(videoId, titleId); setTitles(titles.filter((t) => t.id !== titleId)); } catch {} };
  const handleToggleGenre = async (genreId: number) => { const next = genreIds.includes(genreId) ? genreIds.filter((id) => id !== genreId) : [...genreIds, genreId]; try { await api.video.genres.update(videoId, next); setGenreIds(next); } catch {} };
  const handleSeasonsChange = (newSeasons: Season[]) => { setSeasons(newSeasons); };
  const handleDeleteSeasonClose = () => { setShowDeleteSeasonModal(false); setDeleteSeasonNum(null); };
  const handleDeleteEpisodeClose = () => { setShowDeleteEpisodeModal(false); setDeleteEpisodeNum(null); };

  const bd = backdropUrl(detail?.image_backdrop ?? null);
  const c = useDetailColors(!!bd);
  const sortedEpisodes = useMemo(() => [...episodes].sort((a, b) => a.episode_number - b.episode_number), [episodes]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="text-text-tertiary animate-spin" /></div>;
  if (error || !detail) return <div className="min-h-screen flex flex-col items-center justify-center text-text-tertiary"><p className="text-lg mb-4">{t("browse.noResult")}</p><Link href="/browse" className="text-text-secondary hover:text-text-primary text-sm underline">{t("nav.browse")}</Link></div>;

  const poster = posterUrl(detail.image_poster, "w500");
  const externalIds: ExternalId[] = detail.external_ids ?? [];
  const displayTitle = locale === "en" && detail.origin_title ? detail.origin_title : detail.video_title;
  const castList = persons.filter((p) => p.department === "cast");
  const crewList = persons.filter((p) => p.department === "crew");
  const canEdit = detail.is_can_edit;


  return (
    <div className="min-h-screen bg-bg-primary">
      <DetailHero
        backdropUrl={bd}
        priorityBackdrop
        onBack={() => router.back()}
        backLabel={l.back}
        posterSlot={
          poster ? <Image src={poster} alt={detail.video_title || ""} width={260} height={390} unoptimized className="w-[200px] md:w-[260px] h-auto rounded-2xl shadow-elevated object-cover" /> : <div className={`w-[200px] md:w-[260px] aspect-[2/3] rounded-2xl ${c.posterBg} flex items-center justify-center`}>{detail.video_type === "tv" ? <Tv size={48} className={c.posterIc} /> : <Film size={48} className={c.posterIc} />}</div>
        }
        infoSlot={<>
              <div className="flex items-end gap-3 mb-2">
                <h1 className={`text-3xl md:text-5xl font-bold tracking-tight ${c.h1}`}>{displayTitle}</h1>
                {canEdit && <div className="flex items-end gap-1">
                  <button onClick={() => setShowAliasModal(true)} className={`p-1.5 rounded-lg transition-all ${c.icon}`} title={l.addAlias}><Pencil size={14} /></button>
                  <button onClick={() => setShowSyncModal(true)} className={`p-1.5 rounded-lg transition-all ${c.icon}`} title={l.sync}><RefreshCw size={14} /></button>
                  <button onClick={() => setShowDeleteModal(true)} className={`p-1.5 rounded-lg transition-all text-red-400/40 hover:text-red-400`} title={l.deleteVideo}><Trash2 size={14} /></button>
                </div>}
              </div>
              {detail.origin_title && detail.origin_title !== displayTitle && <p className={`text-lg mb-2 ${c.sub}`}>{detail.origin_title}</p>}
              {detail.tagline && <p className={`text-sm italic mb-4 ${c.sub}`}>&ldquo;{detail.tagline}&rdquo;</p>}

              <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-4 ${c.meta}`}>
                {detail.vote_average != null && <span className={`flex items-center gap-1.5 ${c.metaHi}`}><Star size={14} className="text-amber-400" /> {detail.vote_average.toFixed(1)}</span>}
                {detail.runtime && <span className="flex items-center gap-1.5"><Clock size={14} /> {formatRuntime(detail.runtime, locale)}</span>}
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(detail.date_air, locale)}</span>
                {detail.origin_countrys.length > 0 && <span className="flex items-center gap-1.5"><Globe size={14} /> {detail.origin_countrys.join(", ")}</span>}
                {detail.original_languages.length > 0 && <span className="flex items-center gap-1.5"><Film size={14} /> {detail.original_languages.join(", ")}</span>}
                {detail.is_adult && <span>18+</span>}
              </div>

              {(genreIds.length > 0 || canEdit) && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {genres.filter((g) => genreIds.includes(g.id) && g.name).map((g, i) => (<span key={`genre-${i}-${g.name}`} className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${c.tag}`}>{g.name}</span>))}
                  {canEdit && <button onClick={() => setShowGenreModal(true)} className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-all ${c.tag}`} title={l.editGenres}><Plus size={10} /></button>}
                </div>
              )}

              {titles.length > 0 && (<div className="flex flex-wrap gap-2 mb-4">{titles.map((title) => (<span key={`title-${title.id}`} className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${c.tag}`}>{title.title}{title.is_lock ? <Lock size={8} /> : canEdit && <button onClick={() => handleDeleteTitle(title.id)} className="ml-0.5 text-white/30 hover:text-red-400 transition-colors"><X size={8} /></button>}</span>))}</div>)}

              {externalIds.length > 0 && (<div className="flex flex-wrap gap-2 mb-2">{externalIds.map((ext) => {const href = ext.type === "homepage" ? ext.value : ext.type === "tmdb" ? `https://www.themoviedb.org/${detail.video_type}/${ext.value}` : ext.type === "imdb" ? `https://www.imdb.com/title/${ext.value}` : null; return (<a key={`ext-${ext.type}`} href={href ?? undefined} target={href ? "_blank" : undefined} rel={href ? "noopener noreferrer" : undefined} className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all ${c.link} ${!href ? "cursor-default" : ""}`}>{ext.type.toUpperCase()}{href && <ExternalLink size={9} />}</a>);})}</div>)}

              {detail.video_description?.trim() && <p className={`text-sm leading-relaxed max-w-3xl mt-3 ${c.sub}`}>{detail.video_description}</p>}

              <div className="flex flex-wrap items-center gap-3 mt-4">
                {detail.parts_count > 0 && <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs ${c.tag}`}><span className={c.sub}>{l.partsCount}</span><span className="font-semibold">{detail.parts_count}</span></div>}
                {detail.vote_count != null && <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs ${c.tag}`}><span className={c.sub}>{l.votes}</span><span className="font-semibold">{detail.vote_count}</span></div>}
              </div>

            </>}
        />

      <div className="relative z-10 px-6 pt-4 pb-20"><div className="max-w-[1400px] mx-auto space-y-8">

        {castList.length > 0 && <div><h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-4">{l.cast}</h3><div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">{castList.map((person) => {const avatar = profileUrl(person.image_profile, "w185"); return (<Link key={`cast-${person.person_id}`} href={`/person/${person.person_id}`} className="group flex flex-col items-center shrink-0 w-[80px]"><div className="relative w-16 h-16 rounded-full overflow-hidden bg-bg-hover mb-2 group-hover:ring-1 group-hover:ring-text-tertiary transition-all">{avatar ? <Image src={avatar} alt={person.name} fill sizes="64px" unoptimized className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Users size={16} className="text-text-tertiary" /></div>}</div><span className="text-xs font-medium text-text-primary text-center line-clamp-1 group-hover:text-accent transition-colors">{person.name}</span>{person.character && <span className="text-[10px] text-text-tertiary text-center line-clamp-1 mt-0.5">{person.character}</span>}</Link>);})}</div></div>}
        {crewList.length > 0 && <div><h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-4">{l.crew}</h3><div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">{crewList.map((person) => {const avatar = profileUrl(person.image_profile, "w185"); return (<Link key={`crew-${person.person_id}`} href={`/person/${person.person_id}`} className="group flex flex-col items-center shrink-0 w-[80px]"><div className="relative w-16 h-16 rounded-full overflow-hidden bg-bg-hover mb-2 group-hover:ring-1 group-hover:ring-text-tertiary transition-all">{avatar ? <Image src={avatar} alt={person.name} fill sizes="64px" unoptimized className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Users size={16} className="text-text-tertiary" /></div>}</div><span className="text-xs font-medium text-text-primary text-center line-clamp-1 group-hover:text-accent transition-colors">{person.name}</span>{person.character && <span className="text-[10px] text-text-tertiary text-center line-clamp-1 mt-0.5">{person.character}</span>}</Link>);})}</div></div>}

        {parts.length > 0 && <div><h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-3"><span className="inline-flex items-center gap-1"><Layers size={12} /> {l.parts}</span></h3><div className="flex flex-wrap gap-2">{parts.map((part) => (<span key={part.part_id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-hover text-text-secondary"><span className="font-mono text-text-tertiary">P{part.part_number}</span><span className="truncate max-w-[160px]">{part.part_title}</span>{part.vote_average != null && <span className="flex items-center gap-0.5 text-text-tertiary"><Star size={9} /> {part.vote_average.toFixed(1)}</span>}</span>))}</div></div>}

        {detail.video_type === "tv" && (seasons.length > 0 || canEdit) && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em]">{l.seasonsEpisodes}</h3>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setSelectedSeason(null)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSeason === null ? "bg-text-primary text-bg-primary" : "bg-bg-hover text-text-secondary hover:text-text-primary"}`}>{l.allSeasons}</button>
                {seasons.map((s) => (
                  <button key={s.season_id} onClick={() => setSelectedSeason(s.season_number)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSeason === s.season_number ? "bg-text-primary text-bg-primary" : "bg-bg-hover text-text-secondary hover:text-text-primary"}`}>S{s.season_number}</button>
                ))}
                {canEdit && <button onClick={() => setShowSeasonModal(true)} className="px-4 py-2 rounded-xl text-sm font-medium transition-all bg-bg-hover text-text-secondary hover:text-text-primary"><Plus size={14} /></button>}
              </div>
            </div>

            {selectedSeason === null ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
                {seasons.map((s) => {
                  const sPoster = posterUrl(s.image_poster, "w342");
                  return (
                    <button key={s.season_id} onClick={() => setSelectedSeason(s.season_number)} className="group text-left flex flex-col">
                      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-bg-input mb-2 group-hover:shadow-elevated transition-all">
                        {sPoster ? <Image src={sPoster} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><Tv size={32} className="text-text-tertiary" /></div>}
                      </div>
                      <h4 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors line-clamp-1">{l.season}{s.season_number}{l.seasonSuffix}</h4>
                      <p className="text-xs text-text-tertiary mt-0.5">{s.episode_count != null ? s.episode_count : 0} {l.episodes}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="animate-fade-in">
                {(() => { const currentSeason = seasons.find((s) => s.season_number === selectedSeason); return currentSeason ? (
                  <div className="grid md:grid-cols-[160px_1fr] gap-4 mb-6 p-4 rounded-xl bg-bg-hover/50">
                    <div className="relative w-full aspect-[2/3]">{posterUrl(currentSeason.image_poster, "w342") ? <Image src={posterUrl(currentSeason.image_poster, "w342")!} alt="" fill sizes="(max-width: 768px) 100vw, 342px" unoptimized className="rounded-lg object-cover" /> : <div className="w-full aspect-[2/3] rounded-lg bg-bg-input flex items-center justify-center"><Tv size={32} className="text-text-tertiary" /></div>}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-text-primary">{l.season}{currentSeason.season_number}{l.seasonSuffix}</h3>
                        {canEdit && <>
                          <button onClick={() => { setEditSeason(currentSeason); setShowEditSeasonModal(true); }} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary transition-all"><Pencil size={14} /></button>
                          <button onClick={() => { setDeleteSeasonNum(currentSeason.season_number); setShowDeleteSeasonModal(true); }} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                        </>}
                      </div>
                      {currentSeason.season_description && <p className="text-sm text-text-secondary leading-relaxed mb-3">{currentSeason.season_description}</p>}
                      <div className="flex items-center gap-4 text-xs text-text-tertiary">
                        {currentSeason.date_air && <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(currentSeason.date_air, locale)}</span>}
                        {currentSeason.episode_count != null && <span>{currentSeason.episode_count} {l.episodes}</span>}
                        {currentSeason.vote_average != null && <span className="flex items-center gap-1"><Star size={12} />{currentSeason.vote_average.toFixed(1)}</span>}
                      </div>
                    </div>
                  </div>
                ) : null; })()}
                {loadingEpisodes ? <div className="flex justify-center py-12"><Loader2 size={24} className="text-text-tertiary animate-spin" /></div> : (
                  <div className="space-y-2">
                    {sortedEpisodes.map((ep) => { const epPoster = posterUrl(ep.image_poster, "w185"); return (
                      <div key={ep.episode_id} className="flex gap-4 p-4 rounded-xl bg-bg-hover/50 hover:bg-bg-hover transition-all group">
                        <div className="relative w-28 shrink-0 aspect-video rounded-lg overflow-hidden bg-bg-input">{epPoster ? <Image src={epPoster} alt="" fill sizes="112px" unoptimized className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-text-tertiary"><Tv size={20} /></div>}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-text-tertiary">E{ep.episode_number}</span>
                            <h4 className="text-sm font-medium text-text-primary truncate">{ep.episode_title}</h4>
                            {canEdit && <>
                              <button onClick={() => { setEditEpisode(ep); setShowEditEpisodeModal(true); }} className="p-1 rounded-lg text-text-tertiary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"><Pencil size={12} /></button>
                              <button onClick={() => { setDeleteEpisodeNum(ep.episode_number); setShowDeleteEpisodeModal(true); }} className="p-1 rounded-lg text-red-400/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                            </>}
                          </div>
                          {ep.episode_description && <p className="text-xs text-text-tertiary line-clamp-2">{ep.episode_description}</p>}
                          <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                            {ep.runtime && <span>{formatRuntime(ep.runtime, locale)}</span>}
                            {ep.date_air && <span>{formatDate(ep.date_air, locale)}</span>}
                            {ep.vote_average != null && <span className="flex items-center gap-0.5"><Star size={10} />{ep.vote_average.toFixed(1)}</span>}
                          </div>
                        </div>
                      </div>
                    ); })}
                    {canEdit && selectedSeason !== null && (
                      <div className="flex gap-2">
                        <button onClick={() => setShowAddEpisodesModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-bg-hover text-text-secondary hover:text-text-primary transition-all"><Plus size={14} /> {l.addEpisodes}</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(() => {
          const imageConfig = {
            backdrop: { width: 300, height: 169, url: (path: string) => backdropUrl(path, "w300") },
            poster: { width: 185, height: 278, url: (path: string) => posterUrl(path, "w185") },
            logo: { width: 300, height: 169, url: (path: string) => logoUrl(path, "w300") },
          } as const;
          const byType = (type: ImageItem["type"]) => images.filter((img) => img.type === type);
          const renderSection = (type: keyof typeof imageConfig, title: string, aspect: string, contain?: boolean, cols?: string) => {
            const items = byType(type);
            const config = imageConfig[type];
            if (items.length === 0) return null;
            return (
              <div>
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-3">{title}</h3>
                <div className={`grid ${cols || "grid-cols-4 sm:grid-cols-5 md:grid-cols-6"} gap-2`}>
                  {items.map((img) => {
                    const imageSrc = config.url(img.image_path);
                    return (
                      <div key={img.image_id} className={`group relative ${aspect} rounded-lg overflow-hidden bg-bg-hover border border-border-primary`}>
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={img.type}
                            width={config.width}
                            height={config.height}
                            unoptimized
                            className={`h-full w-full ${contain ? "object-contain" : "object-cover"}`}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-text-tertiary">
                            <Film size={18} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          <div className="flex gap-1">
                            {!img.is_default && <button onClick={() => api.image.setDefault(img.image_id).then(refreshImages)} className="px-2 py-1 rounded text-[10px] bg-white/20 text-white hover:bg-white/30">{l.setDefault}</button>}
                            {img.is_can_delete && <button onClick={() => api.image.delete(img.image_id).then(refreshImages)} className="px-2 py-1 rounded text-[10px] bg-white/20 text-white hover:bg-white/30">{l.delete}</button>}
                          </div>
                        </div>
                        {img.is_default && <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-text-primary text-bg-primary">★</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          };
          return images.length > 0 ? (
            <div className="space-y-8">
              {renderSection("backdrop", l.backdrop, "aspect-video")}
              {renderSection("poster", l.poster, "aspect-[9/16]", false, "grid-cols-6 sm:grid-cols-8 md:grid-cols-10")}
              {renderSection("logo", l.logo, "aspect-video", true, "grid-cols-4 sm:grid-cols-5 md:grid-cols-6")}
            </div>
          ) : null;
        })()}
      </div></div>

      <AliasModal open={showAliasModal} onClose={() => setShowAliasModal(false)} videoId={videoId} titles={titles} onTitlesChange={setTitles} canEdit={canEdit} l={l} />
      <GenreModal open={showGenreModal} onClose={() => setShowGenreModal(false)} genres={genres} genreIds={genreIds} onToggleGenre={handleToggleGenre} canEdit={canEdit} l={l} />
      <SyncModal open={showSyncModal} onClose={() => setShowSyncModal(false)} l={l} locale={locale} />
      <DeleteVideoModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} videoId={videoId} onDeleted={() => router.push("/browse")} l={l} />
      <SeasonModals
        showAdd={showSeasonModal} showEdit={showEditSeasonModal} showDelete={showDeleteSeasonModal}
        editSeason={editSeason} deleteSeasonNum={deleteSeasonNum} videoId={videoId}
        onCloseAdd={() => setShowSeasonModal(false)} onCloseEdit={() => { setShowEditSeasonModal(false); setEditSeason(null); }} onCloseDelete={handleDeleteSeasonClose}
        onSeasonsChange={handleSeasonsChange} l={l}
      />
      <EpisodeModals
        showEdit={showEditEpisodeModal} showDelete={showDeleteEpisodeModal} showAdd={showAddEpisodesModal}
        editEpisode={editEpisode} deleteEpisodeNum={deleteEpisodeNum} videoId={videoId} seasonNumber={selectedSeason}
        onCloseEdit={() => { setShowEditEpisodeModal(false); setEditEpisode(null); }} onCloseDelete={handleDeleteEpisodeClose} onCloseAdd={() => setShowAddEpisodesModal(false)}
        onEpisodesChange={setEpisodes} l={l}
      />
    </div>
  );
}
