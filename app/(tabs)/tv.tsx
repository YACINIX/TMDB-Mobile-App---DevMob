import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  getTvAiringToday,
  getTvOnTheAir,
  getTvPopular,
  getTvTopRated,
  searchTv,
} from "../../src/services/tmdb";

import { posterUrl } from "../../src/services/images";

const CATS = [
  { key: "airing", label: "Airing Today" },
  { key: "onair", label: "On The Air" },
  { key: "popular", label: "Popular" },
  { key: "top", label: "Top Rated" },
];

export default function TV() {
  const [cat, setCat] = useState("airing");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Search
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const loader = useMemo(() => {
    if (cat === "airing") return getTvAiringToday;
    if (cat === "onair") return getTvOnTheAir;
    if (cat === "popular") return getTvPopular;
    return getTvTopRated;
  }, [cat]);

  async function loadCategory() {
    setLoading(true);
    setErr("");
    try {
      const data = await loader();
      setItems(data.results || []);
    } catch (e: any) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isSearching) loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, isSearching]);

  async function onSearch() {
    const q = query.trim();
    if (!q) {
      setIsSearching(false);
      loadCategory();
      return;
    }

    setIsSearching(true);
    setLoading(true);
    setErr("");
    try {
      const data = await searchTv(q);
      setItems(data.results || []);
    } catch (e: any) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setIsSearching(false);
    loadCategory();
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* Search bar */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search TV shows..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />

        <Pressable
          onPress={onSearch}
          style={{
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 12,
            justifyContent: "center",
          }}
        >
          <Text>Search</Text>
        </Pressable>

        {isSearching ? (
          <Pressable
            onPress={clearSearch}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 12,
              justifyContent: "center",
            }}
          >
            <Text>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Cat buttons */}
      {!isSearching ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {CATS.map((c) => (
            <Pressable
              key={c.key}
              onPress={() => setCat(c.key)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                opacity: cat === c.key ? 1 : 0.6,
              }}
            >
              <Text>{c.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={{ marginBottom: 12 }}>
          Results for: <Text style={{ fontWeight: "bold" }}>{query.trim()}</Text>
        </Text>
      )}

      {loading ? (
        <ActivityIndicator />
      ) : err ? (
        <Text style={{ color: "red" }}>{err}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text>No results.</Text>}
          renderItem={({ item }) => {
            const img = posterUrl(item.poster_path);

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: { type: "tv", id: String(item.id) },
                  })
                }
                style={{
                  flexDirection: "row",
                  gap: 12,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                }}
              >
                {img ? (
                  <Image source={{ uri: img }} style={{ width: 60, height: 90, borderRadius: 8 }} />
                ) : null}

                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                  <Text numberOfLines={2}>{item.overview}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
