import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { listFavorites } from "../../src/db/storage";
import { posterUrl } from "../../src/services/images";

export default function Favorites() {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      const rows = await listFavorites();
      setItems(rows || []);
    } catch (e: any) {
      setErr(String(e.message || e));
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        Favorites
      </Text>

      {err ? <Text style={{ color: "red" }}>{err}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => `${item.media_type}-${item.id}`}
        ListEmptyComponent={<Text>No favorites yet.</Text>}
        renderItem={({ item }) => {
          const img = posterUrl(item.poster_path);

          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/details",
                  params: { type: item.media_type, id: String(item.id) },
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
                <Image
                  source={{ uri: img }}
                  style={{ width: 60, height: 90, borderRadius: 8 }}
                />
              ) : null}

              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                <Text>{item.media_type}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
