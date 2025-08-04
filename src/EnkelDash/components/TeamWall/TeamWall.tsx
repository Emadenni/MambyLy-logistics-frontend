import React, { useMemo, useState } from "react";
import "./TeamWall.scss";

type User = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
};

type FeedComment = {
  id: string;
  author: User;
  createdAt: string;
  text: string;
};

type FeedPost = {
  id: string;
  author: User;
  createdAt: string;
  content: string;
  images?: string[];
  files?: { name: string; url: string }[];
  pinned?: boolean;
  reactions?: Record<string, number>;
  comments?: FeedComment[];
  team?: string;
  tags?: string[];
};

 

const mockUser: User = { id: "u1", name: "Mario Rossi" };

const MOCK_POSTS: FeedPost[] = [
  {
    id: "p1",
    author: { id: "u2", name: "Laura Bianchi", role: "PM" },
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    content: "Kickoff riuscito! 🚀 Grazie a tutti. #release",
    pinned: true,
    reactions: { like: 6, celebrate: 3 },
    comments: [
      {
        id: "c1",
        author: { id: "u3", name: "Edoardo" },
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        text: "Grande!"
      }
    ],
    team: "Product",
    tags: ["#release"]
  },
  {
    id: "p2",
    author: { id: "u4", name: "Giulia Verdi", role: "Sales" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    content: "Chiuso contratto con ACME 🎉 #win",
    reactions: { celebrate: 5 },
    team: "Sales",
    tags: ["#win"]
  },
  {
    id: "p3",
    author: { id: "u5", name: "Enzo Neri", role: "CS" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    content: "CSAT 94% questa settimana. Bravi tutti!",
    reactions: { like: 4 },
    team: "Support"
  }
];

const TEAMS = ["All", "Product", "Sales", "Support", "Marketing"];

const TeamWall: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);
  const [filterTeam, setFilterTeam] = useState<string>("All");
  const [onlyPinned, setOnlyPinned] = useState<boolean>(false);
  const [sort, setSort] = useState<"new" | "top">("new");

  const filtered = useMemo(() => {
    let res = [...posts];
    if (filterTeam !== "All") res = res.filter(p => p.team === filterTeam);
    if (onlyPinned) res = res.filter(p => p.pinned);
    if (sort === "new") {
      res.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else {
      res.sort((a, b) => (sumReactions(b) - sumReactions(a)) || (+new Date(b.createdAt) - +new Date(a.createdAt)));
    }
    return res;
  }, [posts, filterTeam, onlyPinned, sort]);
  

  function sumReactions(p: FeedPost) {
    return Object.values(p.reactions || {}).reduce((a, b) => a + b, 0);
  }

  function handlePublish(text: string) {
    if (!text.trim()) return;
    const newPost: FeedPost = {
      id: "p" + Math.random().toString(36).slice(2),
      author: mockUser,
      createdAt: new Date().toISOString(),
      content: text,
      reactions: {},
      comments: [],
      team: "Product"
    };
    setPosts(prev => [newPost, ...prev]);
  }

  function togglePin(id: string) {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, pinned: !p.pinned } : p)));
  }

  function addReaction(id: string, kind: string) {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, reactions: { ...p.reactions, [kind]: (p.reactions?.[kind] || 0) + 1 } }
          : p
      )
    );
  }

  function addComment(postId: string, text: string) {
    if (!text.trim()) return;
    const newC: FeedComment = {
      id: "c" + Math.random().toString(36).slice(2),
      author: mockUser,
      createdAt: new Date().toISOString(),
      text
    };
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, comments: [...(p.comments || []), newC] } : p
      )
    );
  }

  return (
    <section className="teamwall">
      {/* DESKTOP ONLY: Pinned + Trending in orizzontale */}
      <div className="teamwall__top desktop-only">
        <PinnedBox posts={posts.filter(p => p.pinned)} onGo={() => setOnlyPinned(true)} />
        <TrendingTags posts={posts} />
      </div>

      <div className="teamwall__main">
        <FeedComposer onPublish={handlePublish} />
        <FeedFilters
          teams={TEAMS}
          filterTeam={filterTeam}
          onTeamChange={setFilterTeam}
          onlyPinned={onlyPinned}
          onOnlyPinnedChange={setOnlyPinned}
          sort={sort}
          onSortChange={setSort}
        />
        <FeedList
          posts={filtered}
          onTogglePin={togglePin}
          onReact={addReaction}
          onAddComment={addComment}
        />
      </div>
    </section>
  );
};

export default TeamWall;

/* --- Components --- */
const FeedComposer: React.FC<{ onPublish: (text: string) => void }> = ({ onPublish }) => {
  const [text, setText] = useState("");
  return (
    <div className="composer">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Scrivi un aggiornamento per il team…"
      />
      <div className="composer__actions">
        <button className="btn" onClick={() => { onPublish(text); setText(""); }}>Pubblica</button>
      </div>
    </div>
  );
};

const FeedFilters: React.FC<{
  teams: string[];
  filterTeam: string;
  onTeamChange: (v: string) => void;
  onlyPinned: boolean;
  onOnlyPinnedChange: (v: boolean) => void;
  sort: "new" | "top";
  onSortChange: (v: "new" | "top") => void;
}> = ({ teams, filterTeam, onTeamChange, onlyPinned, onOnlyPinnedChange, sort, onSortChange }) => {
  return (
    <div className="filters">
      <select value={filterTeam} onChange={(e) => onTeamChange(e.target.value)}>
        {teams.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <label className="filters__checkbox">
        <input type="checkbox" checked={onlyPinned} onChange={(e) => onOnlyPinnedChange(e.target.checked)} />
        <span>Solo pinned</span>
      </label>
      <select value={sort} onChange={(e) => onSortChange(e.target.value as "new" | "top")}>
        <option value="new">Recenti</option>
        <option value="top">Top</option>
      </select>
    </div>
  );
};

const FeedList: React.FC<{
  posts: FeedPost[];
  onTogglePin: (id: string) => void;
  onReact: (id: string, kind: string) => void;
  onAddComment: (postId: string, text: string) => void;
}> = ({ posts, onTogglePin, onReact, onAddComment }) => {
  if (!posts.length) return <div className="empty">Nessun post</div>;
  return (
    <div className="feed">
      {posts.map(p => (
        <FeedCard
          key={p.id}
          post={p}
          onTogglePin={onTogglePin}
          onReact={onReact}
          onAddComment={onAddComment}
        />
      ))}
    </div>
  );
};

const FeedCard: React.FC<{
  post: FeedPost;
  onTogglePin: (id: string) => void;
  onReact: (id: string, kind: string) => void;
  onAddComment: (postId: string, text: string) => void;
}> = ({ post, onTogglePin, onReact, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  return (
    <article className="card">
      <header className="card__header">
        <div className="card__avatar" />
        <div className="card__meta">
          <div className="card__author">{post.author.name}</div>
          <div className="card__sub">
            {post.team || "General"} · {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="card__actions">
          <button className={`pin ${post.pinned ? "active" : ""}`} onClick={() => onTogglePin(post.id)}>📌</button>
        </div>
      </header>

      <div className="card__content">
        <p>{post.content}</p>
        {post.tags?.length ? (
          <div className="card__tags">
            {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        ) : null}
      </div>

      <footer className="card__footer">
        <div className="reactions">
          <button onClick={() => onReact(post.id, "like")}>👍 {post.reactions?.like || 0}</button>
          <button onClick={() => onReact(post.id, "celebrate")}>🎉 {post.reactions?.celebrate || 0}</button>
          <button onClick={() => setShowComments(s => !s)}>💬 {post.comments?.length || 0}</button>
        </div>
      </footer>

      {showComments && (
        <>
          <div className="comments">
            {(post.comments || []).map(c => (
              <div className="comment" key={c.id}>
                <div className="comment__avatar" />
                <div className="comment__body">
                  <div className="comment__meta">
                    <span className="author">{c.author.name}</span>
                    <span className="time">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text">{c.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="comment-composer">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Scrivi un commento…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (commentText.trim()) {
                    onAddComment(post.id, commentText);
                    setCommentText("");
                  }
                }
              }}
            />
            <button
              className="btn"
              onClick={() => {
                if (commentText.trim()) {
                  onAddComment(post.id, commentText);
                  setCommentText("");
                }
              }}
            >
              Invia
            </button>
          </div>
        </>
      )}
    </article>
  );
};

const PinnedBox: React.FC<{ posts: FeedPost[]; onGo: () => void }> = ({ posts, onGo }) => {
  if (!posts.length) return (
    <div className="sidebox sidebox--empty">
      <div className="sidebox__title">Pinned</div>
      <div className="muted">Niente di fissato</div>
    </div>
  );
  return (
    <div className="sidebox">
      <div className="sidebox__title">Pinned</div>
      <ul>
        {posts.slice(0, 5).map(p => (
          <li key={p.id} className="sidebox__item" onClick={onGo}>
            <span className="dot" /> {p.content.slice(0, 60)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TrendingTags: React.FC<{ posts: FeedPost[] }> = ({ posts }) => {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach(p => (p.tags || []).forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [posts]);
  return (
    <div className="sidebox">
      <div className="sidebox__title">Trending</div>
      {counts.length ? (
        <div className="tags">
          {counts.map(([t]) => <span key={t} className="tag">{t}</span>)}
        </div>
      ) : (
        <div className="muted">Nessun tag</div>
      )}
    </div>
  );
};
