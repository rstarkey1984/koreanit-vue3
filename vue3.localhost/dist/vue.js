const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    // 서버 주소 (여기만 환경에 맞게 수정하면 됨)
    // - vue3.localhost를 쓰고 있으면 그대로
    // - 아니면 보통 http://localhost:3000
    const API_BASE = ref("http://vue3.localhost");

    const endpoint = ref(`${API_BASE.value}/api/news`);
    const loading = ref(false);
    const error = ref("");

    const meta = ref({ source: "", updatedAt: "", count: 0 });
    const items = ref([]);

    const q = ref("");
    const sort = ref("latest");
    const onlyFav = ref(false);

    // localStorage keys
    const LS_READ = "news.readIds.v1";
    const LS_FAV = "news.favIds.v1";
    const LS_TOKEN = "auth.accessToken.v1";

    // Sets
    const readSet = ref(new Set());
    const favSet = ref(new Set());

    const readCount = computed(() => readSet.value.size);
    const favCount = computed(() => favSet.value.size);

    function safeParseArray(raw) {
      try {
        const v = JSON.parse(raw || "[]");
        return Array.isArray(v) ? v : [];
      } catch (e) {
        return [];
      }
    }

    function loadSets() {
      readSet.value = new Set(safeParseArray(localStorage.getItem(LS_READ)));
      favSet.value = new Set(safeParseArray(localStorage.getItem(LS_FAV)));
    }

    function saveRead() {
      localStorage.setItem(LS_READ, JSON.stringify(Array.from(readSet.value)));
    }

    function saveFav() {
      localStorage.setItem(LS_FAV, JSON.stringify(Array.from(favSet.value)));
    }

    // ---------- read / fav ----------
    function isRead(id) {
      return readSet.value.has(id);
    }

    function markRead(id) {
      if (!id) return;
      if (!readSet.value.has(id)) {
        readSet.value.add(id);
        saveRead();
      }
    }

    function toggleFav(id) {
      if (!id) return;
      if (favSet.value.has(id)) favSet.value.delete(id);
      else favSet.value.add(id);
      saveFav();
    }

    function isFav(id) {
      return favSet.value.has(id);
    }

    function clearRead() {
      readSet.value.clear();
      saveRead();
    }

    function clearFav() {
      favSet.value.clear();
      saveFav();
    }

    function toggleOnlyFav() {
      onlyFav.value = !onlyFav.value;
    }

    // ---------- date ----------
    function parseRssDate(s) {
      const t = Date.parse(s || "");
      return Number.isNaN(t) ? NaN : t;
    }

    function formatRssDate(s) {
      const t = parseRssDate(s);
      if (Number.isNaN(t)) return "-";
      const d = new Date(t);
      return d.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    function formatDateTime(iso) {
      const t = Date.parse(iso || "");
      if (Number.isNaN(t)) return "-";
      const d = new Date(t);
      return d.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    // ---------- computed (filter/sort) ----------
    const filteredItems = computed(() => {
      const keyword = (q.value || "").toLowerCase();

      let list = items.value.filter((x) => {
        if (onlyFav.value && !isFav(x.id)) return false;
        if (!keyword) return true;

        const title = (x.title || "").toLowerCase();
        const pub = (x.publisher || "").toLowerCase();
        return title.includes(keyword) || pub.includes(keyword);
      });

      const byTime = (a, b) => parseRssDate(a.publishedAt) - parseRssDate(b.publishedAt);

      if (sort.value === "latest") list.sort((a, b) => byTime(b, a));
      if (sort.value === "oldest") list.sort(byTime);
      if (sort.value === "publisher")
        list.sort((a, b) => (a.publisher || "").localeCompare(b.publisher || "", "ko"));
      if (sort.value === "title")
        list.sort((a, b) => (a.title || "").localeCompare(b.title || "", "ko"));

      return list;
    });

    // ---------- api ----------
    async function reload() {
      loading.value = true;
      error.value = "";

      try {
        const res = await fetch(endpoint.value, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const json = await res.json();

        if (!json || json.success !== true) {
          throw new Error(json?.message || "API 응답 실패");
        }

        const payload = json.data || {};
        meta.value.source = payload.source || "";
        meta.value.updatedAt = payload.updatedAt || "";
        meta.value.count = payload.count || 0;
        items.value = Array.isArray(payload.items) ? payload.items : [];
      } catch (e) {
        error.value = e?.message || String(e);
      } finally {
        loading.value = false;
      }
    }

    // ---- auth (prompt login) ----
    const token = ref(localStorage.getItem(LS_TOKEN) || "");
    const hasToken = computed(() => !!token.value);

    function setToken(next) {
      token.value = next || "";
      if (token.value) localStorage.setItem(LS_TOKEN, token.value);
      else localStorage.removeItem(LS_TOKEN);
    }

    async function promptLogin() {
      const id = prompt("아이디를 입력하세요", "admin");
      if (!id) return;

      const password = prompt("비밀번호를 입력하세요", "1234");
      if (!password) return;

      try {
        const res = await fetch(`${API_BASE.value}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ id, password }),
        });

        const json = await res.json();

        if (json && json.success === true && json.data && json.data.token) {
          setToken(json.data.token);
          alert("로그인 성공");
        } else {
          alert(json?.message || "로그인 실패");
        }
      } catch (e) {
        alert(e?.message || String(e));
      }
    }

    function logout() {
      setToken("");
      alert("로그아웃(토큰 삭제)");
    }

    async function callMe() {
      if (!token.value) {
        alert("토큰이 없습니다. 먼저 로그인하세요.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE.value}/api/auth/me`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token.value}`,
          },
        });

        const json = await res.json();
        alert(JSON.stringify(json, null, 2));
      } catch (e) {
        alert(e?.message || String(e));
      }
    }

    onMounted(() => {
      loadSets();
      reload();
    });

    return {
      // view
      loading, error, meta, items,
      q, sort, onlyFav,
      readCount, favCount, filteredItems,

      // actions
      reload, clearRead, clearFav,
      isRead, markRead, toggleFav, isFav, toggleOnlyFav,

      // format
      formatRssDate, formatDateTime,

      // auth
      hasToken, promptLogin, logout, callMe,
    };
  },
}).mount("#app");