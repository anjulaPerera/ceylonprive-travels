"use client";

import { useEffect, useState } from "react";
import { Link2, Plus, Copy, Trash2, Check, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import { ReviewToken } from "@/types/models";
import toast from "react-hot-toast";

export default function TokensDashboardPage() {
  const [tokens, setTokens] = useState<ReviewToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      const response = await api.get("/api/tokens");
      setTokens(response.data.tokens);
    } catch {
      toast.error("Failed to load tokens");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post("/api/tokens/generate", {
        customerName: customerName.trim() || undefined,
        expiryDays,
      });

      const { reviewUrl } = response.data;
      await navigator.clipboard.writeText(reviewUrl);
      toast.success("Link generated and copied to clipboard!");
      setCustomerName("");
      fetchTokens();
    } catch {
      toast.error("Failed to generate token");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (token: ReviewToken) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL?.replace(":4000", ":3000") || "http://localhost:3000"}/review/${token.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(token.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleRevoke = async (tokenId: string) => {
    if (
      !confirm(
        "Revoke this review link? The customer will no longer be able to use it.",
      )
    )
      return;
    try {
      await api.delete(`/api/tokens/${tokenId}`);
      setTokens((prev) => prev.filter((t) => t.id !== tokenId));
      toast.success("Token revoked");
    } catch {
      toast.error("Cannot revoke a used token");
    }
  };

  const activeTokens = tokens.filter(
    (t) => !t.usedAt && new Date(t.expiresAt) > new Date(),
  );
  const usedTokens = tokens.filter((t) => t.usedAt);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gold mb-2">
          <Link2 size={16} />
          <span className="text-xs tracking-widest uppercase font-sans font-light">
            Review Links
          </span>
        </div>
        <h1 className="font-serif text-4xl text-cream font-light">
          Review Tokens
        </h1>
        <p className="text-cream-dark font-sans font-light text-sm mt-1">
          Generate secure, single-use review links for your customers
        </p>
      </div>

      {/* Generate Form */}
      <div className="border border-gold/20 p-6 bg-navy-light mb-8">
        <h3 className="font-serif text-xl text-cream font-light mb-5">
          Generate New Review Link
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="flex-1 bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors"
            placeholder="Customer name (optional — for your reference)"
          />
          <label htmlFor="token-expiry-select" className="sr-only">
            Link Expiration Period
          </label>
          <select
            id="token-expiry-select"
            value={expiryDays}
            onChange={(e) => setExpiryDays(Number(e.target.value))}
            className="bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors appearance-none min-w-36"
          >
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase font-sans transition-all duration-300 whitespace-nowrap",
              isGenerating
                ? "bg-gold/30 text-gold/50 cursor-not-allowed"
                : "bg-gold text-navy hover:bg-gold-light",
            )}
          >
            <Plus size={16} />
            {isGenerating ? "Generating..." : "Generate & Copy"}
          </button>
        </div>
        <p className="text-cream-dark/50 text-xs font-sans mt-3">
          The link will be automatically copied to your clipboard. Send it to
          your customer via WhatsApp, email, or SMS.
        </p>
      </div>

      {/* Active Tokens */}
      {activeTokens.length > 0 && (
        <div className="mb-8">
          <h3 className="font-serif text-xl text-cream font-light mb-4">
            Active Links ({activeTokens.length})
          </h3>
          <div className="space-y-3">
            {activeTokens.map((token) => (
              <div
                key={token.id}
                className="border border-gold/10 p-4 bg-navy-light flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-cream font-sans text-sm font-medium">
                    {token.customerName ?? "Unnamed customer"}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-cream-dark/60 font-sans">
                      <Clock size={10} />
                      Expires {formatDate(token.expiresAt)}
                    </span>
                    <span className="text-xs text-cream-dark/40 font-sans font-mono">
                      {token.token.slice(0, 12)}...
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(token)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gold/20 text-cream-dark hover:border-gold hover:text-gold text-xs font-sans tracking-wide transition-all duration-200"
                  >
                    {copiedId === token.id ? (
                      <>
                        <Check size={12} className="text-teal" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRevoke(token.id)}
                    className="p-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all duration-200"
                    aria-label={`Revoke review link for ${token.customerName ?? "unnamed customer"}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Used Tokens */}
      {usedTokens.length > 0 && (
        <div>
          <h3 className="font-serif text-xl text-cream font-light mb-4">
            Used Links ({usedTokens.length})
          </h3>
          <div className="space-y-3">
            {usedTokens.map((token) => (
              <div
                key={token.id}
                className="border border-gold/5 p-4 bg-navy opacity-60 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-cream-dark font-sans text-sm">
                    {token.customerName ?? "Unnamed customer"}
                  </p>
                  <p className="text-cream-dark/50 text-xs font-sans mt-0.5">
                    Used on {token.usedAt ? formatDate(token.usedAt) : "—"}
                  </p>
                </div>
                <span className="text-xs font-sans tracking-widest uppercase text-teal border border-teal/30 px-2 py-1">
                  Reviewed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && tokens.length === 0 && (
        <div className="border border-gold/10 p-16 text-center">
          <Link2 size={32} className="text-gold/30 mx-auto mb-4" />
          <p className="font-serif text-xl text-cream-dark font-light">
            No review links yet
          </p>
          <p className="text-cream-dark/50 font-sans text-sm mt-2">
            Generate your first link above and send it to a happy customer.
          </p>
        </div>
      )}
    </div>
  );
}
