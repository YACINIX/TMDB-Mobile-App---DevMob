import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import {
  addFavorite,
  addWatchlist,
  isFavorite,
  isWatchlist,
  removeFavorite,
  removeWatchlist,
} from "../src/db/storage";
import { getMovieDetails, getTvDetails } from "../src/services/tmdb";

export default function Details() {
  const { type, id } = useLocalSearchParams();
  const mediaType = type === "tv" ? "tv" : "movie";
  const mediaId = Number(id);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [fav, setFav] = useState(false);
  const [wl, setWl] = useState(false);
  const [saving, setSaving] = useState(false);

  async function refreshFlags() {
    if (!mediaId) return;
    const f = await isFavorite(mediaId, mediaType);
    const w = await isWatchlist(mediaId, mediaType);
    setFav(f);
    setWl(w);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!mediaId) return;

      setLoading(true);
      setErr("");
      try {
        const details =
          mediaType === "tv"
            ? await getTvDetails(String(mediaId))
            : await getMovieDetails(String(mediaId));

        if (!cancelled) setData(details);
        if (!cancelled) await refreshFlags();
      } catch (e: any) {
        if (!cancelled) setErr(String(e.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType, mediaId]);

  async function toggleFavorite() {
    if (!data || !mediaId) return;
    setSaving(true);
    try {
      if (fav) {
        await removeFavorite(mediaId, mediaType);
      } else {
        await addFavorite({
          id: mediaId,
          media_type: mediaType,
          title: mediaType === "tv" ? data.name : data.title,
          poster_path: data.poster_path ?? null,
        });
      }
      await refreshFlags();
    } finally {
      setSaving(false);
    }
  }

  async function toggleWatchlist() {
    if (!data || !mediaId) return;
    setSaving(true);
    try {
      if (wl) {
        await removeWatchlist(mediaId, mediaType);
      } else {
        await addWatchlist({
          id: mediaId,
          media_type: mediaType,
          title: mediaType === "tv" ? data.name : data.title,
          poster_path: data.poster_path ?? null,
        });
      }
      await refreshFlags();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (err) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "red" }}>{err}</Text>
      </View>
    );
  }

  if (!data) return null;

  const title = mediaType === "tv" ? data.name : data.title;

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{title}</Text>
      <Text>⭐ {data.vote_average}</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={toggleFavorite}
          disabled={saving}
          style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 }}
        >
          <Text>{fav ? "Remove Favorite" : "Add Favorite"}</Text>
        </Pressable>

        <Pressable
          onPress={toggleWatchlist}
          disabled={saving}
          style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 }}
        >
          <Text>{wl ? "Remove Watchlist" : "Add Watchlist"}</Text>
        </Pressable>
      </View>

      <Text numberOfLines={12}>{data.overview}</Text>
    </View>
  );
}
