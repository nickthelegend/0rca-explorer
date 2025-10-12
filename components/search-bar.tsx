"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "")
  }, [searchParams])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("search", value)
      params.set("page", "1") // Reset to page 1 on new search
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="relative max-w-3xl mx-auto">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
        <Input
          type="search"
          placeholder="Search agents or transactions..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-14 h-14 bg-zinc-900/50 border-white/10 rounded-xl text-base placeholder:text-zinc-600 focus-visible:ring-white/20"
        />
      </div>
    </div>
  )
}
