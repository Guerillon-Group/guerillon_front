'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  Check,
  ChevronRight,
  Globe,
  Image as ImageIcon,
  Info,
  MapPin,
  MoreHorizontal,
  Search,
  Send,
  SlidersHorizontal,
  Smile,
  Star,
  User,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  sender: 'user' | 'agent'
  text: string
  time: string
  imageUrl?: string
  read?: boolean
  reaction?: string
}

type Conversation = {
  id: string
  agentName: string
  agentAvatar: string
  agentRole: string
  propertyTitle: string
  propertySlug: string
  propertyImage: string
  city: string
  district: string
  price: string
  statusText: string
  statusColor: 'green' | 'orange' | 'blue'
  checkIn: string
  checkOut: string
  lastMessage: string
  lastMessageTime: string
  unread: boolean
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    agentName: 'Sarah Mukendi',
    agentAvatar: '/images/agent-portrait.png',
    agentRole: 'Agent certifié · Horizon Kivu',
    propertyTitle: 'Appartement moderne, vue sur le lac',
    propertySlug: 'appartement-moderne-goma',
    propertyImage: '/images/appartement-goma.png',
    city: 'Goma',
    district: 'Himbi',
    price: '1 450 $ / mois',
    statusText: 'Visite confirmée · 14 - 16 Août',
    statusColor: 'green',
    checkIn: 'Ven. 14 Août, 15:00',
    checkOut: 'Dim. 16 Août, 11:00',
    lastMessage: 'Merci, rendez-vous confirmé à l\'appartement !',
    lastMessageTime: '15:21',
    unread: false,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Bonjour Sarah ! Merci d\'avoir confirmé ma demande de visite pour l\'appartement à Himbi.',
        time: '15:15',
        read: true,
      },
      {
        id: 'm2',
        sender: 'user',
        text: 'J\'ai hâte de découvrir la vue sur le lac Kivu !',
        time: '15:16',
        imageUrl: '/images/salon-interieur.png',
        read: true,
      },
      {
        id: 'm3',
        sender: 'agent',
        text: 'Bonjour ! Avec grand plaisir. Je vous attendrai à la réception de la résidence ce vendredi à 15:00.',
        time: '15:20',
        reaction: '👍',
      },
      {
        id: 'm4',
        sender: 'agent',
        text: 'Merci, rendez-vous confirmé à l\'appartement !',
        time: '15:21',
      },
    ],
  },
  {
    id: 'conv-2',
    agentName: 'David Kasaï',
    agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    agentRole: 'Agent immobilier · Kivu Prime',
    propertyTitle: 'Villa d\'architecte avec piscine',
    propertySlug: 'villa-piscine-goma',
    propertyImage: '/images/villa-piscine.png',
    city: 'Goma',
    district: 'Katindo',
    price: '385 000 $',
    statusText: 'Demande d\'informations envoyée',
    statusColor: 'orange',
    checkIn: 'Mer. 19 Août, 10:00',
    checkOut: 'Mer. 19 Août, 12:00',
    lastMessage: 'Est-il possible d\'organiser une visite virtuelle en direct ?',
    lastMessageTime: 'Hier',
    unread: true,
    messages: [
      {
        id: 'm201',
        sender: 'user',
        text: 'Bonjour David, je souhaiterais des précisions sur le titre de propriété de la villa à Katindo.',
        time: 'Hier, 18:30',
        read: true,
      },
      {
        id: 'm202',
        sender: 'user',
        text: 'Est-il possible d\'organiser une visite virtuelle en direct ?',
        time: 'Hier, 18:32',
        read: true,
      },
    ],
  },
]

const EMOJI_REACTIONS = ['👍', '❤️', '👏', '😂', '😊']

export function MessagingCenter() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [activeConvId, setActiveConvId] = useState<string>('conv-1')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [inputText, setInputText] = useState('')
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null)
  const [showRightSidebar, setShowRightSidebar] = useState(true)

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0]

  const filteredConversations = conversations.filter((c) => {
    if (filter === 'unread') return c.unread
    return true
  })

  function handleSendMessage() {
    if (!inputText.trim() || !activeConv) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: inputText,
            lastMessageTime: 'À l\'instant',
            messages: [...c.messages, newMsg],
          }
        }
        return c
      }),
    )

    setInputText('')
  }

  function handleAddReaction(msgId: string, emoji: string) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === msgId) {
                return { ...m, reaction: m.reaction === emoji ? undefined : emoji }
              }
              return m
            }),
          }
        }
        return c
      }),
    )
    setHoveredMsgId(null)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-[1440px] overflow-hidden bg-background">
      {/* 1. PANNEAU GAUCHE : LISTE DES MESSAGES */}
      <aside className="flex w-full max-w-[340px] shrink-0 flex-col border-r border-border bg-card/50 md:w-80 lg:w-[360px]">
        {/* Header de recherche & filtre */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Messages</h1>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" className="rounded-full">
                <Search className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="rounded-full">
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>
          </div>

          {/* Filtres Tous / Non lus */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                filter === 'all'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                filter === 'unread'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              Non lus
            </button>
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60 p-2">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConvId
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setActiveConvId(conv.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-all',
                  isActive ? 'bg-secondary' : 'hover:bg-secondary/40',
                )}
              >
                <div className="relative size-12 shrink-0">
                  <Image
                    src={conv.agentAvatar}
                    alt={conv.agentName}
                    width={48}
                    height={48}
                    className="size-full rounded-full object-cover ring-1 ring-border"
                  />
                  <div className="absolute -bottom-1 -right-1 size-5 overflow-hidden rounded-full border border-background">
                    <Image src={conv.propertyImage} alt="" width={20} height={20} className="size-full object-cover" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-bold text-foreground">{conv.agentName}</p>
                    <span className="text-[11px] text-muted-foreground">{conv.lastMessageTime}</span>
                  </div>
                  <p className="truncate text-xs font-medium text-foreground/90 mt-0.5">{conv.propertyTitle}</p>
                  <p className="truncate text-xs text-muted-foreground mt-1">{conv.lastMessage}</p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={cn(
                        'size-2 rounded-full',
                        conv.statusColor === 'green' && 'bg-emerald-500',
                        conv.statusColor === 'orange' && 'bg-amber-500',
                        conv.statusColor === 'blue' && 'bg-blue-500',
                      )}
                    />
                    <span className="truncate text-[10px] font-semibold text-muted-foreground">{conv.statusText}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* 2. PANNEAU CENTRAL : ZONE DE CHAT */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Header du Chat */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-3">
            <Image
              src={activeConv.agentAvatar}
              alt={activeConv.agentName}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover ring-1 ring-border"
            />
            <div>
              <h2 className="text-sm font-bold text-foreground">{activeConv.agentName}</h2>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="size-3" />
                {activeConv.agentRole}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="rounded-full"
            title="Détails du bien"
          >
            <Info className="size-4" />
          </Button>
        </div>

        {/* Fil des messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center my-2">
            <span className="rounded-full bg-secondary/80 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              Aujourd&apos;hui · {activeConv.statusText}
            </span>
          </div>

          {activeConv.messages.map((msg) => {
            const isUser = msg.sender === 'user'
            const isHovered = hoveredMsgId === msg.id

            return (
              <div
                key={msg.id}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}
                className={cn('group relative flex flex-col', isUser ? 'items-end' : 'items-start')}
              >
                <div className="flex items-end gap-2 max-w-[75%]">
                  {!isUser && (
                    <Image
                      src={activeConv.agentAvatar}
                      alt=""
                      width={28}
                      height={28}
                      className="size-7 rounded-full object-cover mb-1"
                    />
                  )}

                  <div className="relative">
                    {/* Menu de réaction rapide au survol inspiré d'Airbnb */}
                    {isHovered && (
                      <div
                        className={cn(
                          'absolute -top-10 z-10 flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-lg animate-in fade-in zoom-in-95 duration-150',
                          isUser ? 'right-0' : 'left-0',
                        )}
                      >
                        {EMOJI_REACTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleAddReaction(msg.id, emoji)}
                            className="flex size-7 items-center justify-center rounded-full text-sm transition-transform hover:scale-125"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Bulle du message */}
                    <div
                      className={cn(
                        'rounded-2xl p-4 text-sm leading-relaxed shadow-xs',
                        isUser
                          ? 'bg-foreground text-background rounded-br-xs'
                          : 'bg-secondary text-foreground rounded-bl-xs',
                      )}
                    >
                      {msg.imageUrl && (
                        <div className="mb-2 relative aspect-16/10 overflow-hidden rounded-xl">
                          <Image src={msg.imageUrl} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>

                    {/* Badge d'émoji de réaction sous le message */}
                    {msg.reaction && (
                      <div
                        className={cn(
                          'absolute -bottom-3 flex items-center justify-center rounded-full border border-border bg-card px-2 py-0.5 text-xs shadow-xs',
                          isUser ? 'right-2' : 'left-2',
                        )}
                      >
                        {msg.reaction}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
                  <span>{msg.time}</span>
                  {isUser && msg.read && (
                    <span className="flex items-center gap-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                      · Lu par {activeConv.agentName.split(' ')[0]}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Input de saisie du message inspiré Airbnb */}
        <div className="p-4 border-t border-border bg-background">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Temps de réponse habituel : ~30 min</span>
          </div>

          <div className="relative rounded-2xl border border-border bg-card p-3 shadow-sm focus-within:border-foreground/40 transition-colors">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Écrivez un message à l'agent..."
              className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" className="rounded-full text-muted-foreground">
                  <ImageIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="rounded-full text-muted-foreground">
                  <Smile className="size-4" />
                </Button>
              </div>

              <Button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="size-9 rounded-full p-0"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. PANNEAU DROIT : Fiche Récapitulative du Bien / Réservation (Airbnb style) */}
      {showRightSidebar && (
        <aside className="hidden w-80 shrink-0 border-l border-border bg-card p-6 lg:block xl:w-96 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="font-display text-base font-bold text-foreground">Détails de la demande</h3>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowRightSidebar(false)}
              className="rounded-full"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Visuel du bien */}
          <div className="mt-4 relative aspect-16/10 overflow-hidden rounded-2xl border border-border shadow-xs">
            <Image src={activeConv.propertyImage} alt="" fill className="object-cover" />
            <div className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-foreground">
              {activeConv.statusText.split('·')[0]}
            </div>
          </div>

          <div className="mt-4">
            <Link
              href={`/biens/${activeConv.propertySlug}`}
              className="font-display text-lg font-bold text-foreground hover:underline"
            >
              {activeConv.propertyTitle}
            </Link>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {activeConv.district}, {activeConv.city}
            </p>
            <p className="mt-2 text-sm font-bold text-primary">{activeConv.price}</p>
          </div>

          {/* Statut de rendez-vous */}
          <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Calendar className="size-4 text-primary" />
              Rendez-vous de visite
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-border/60 pt-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Début</span>
                <p className="font-bold text-foreground mt-0.5">{activeConv.checkIn}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Fin</span>
                <p className="font-bold text-foreground mt-0.5">{activeConv.checkOut}</p>
              </div>
            </div>
          </div>

          {/* Raccourcis d'actions */}
          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/biens/${activeConv.propertySlug}`} />}
              className="w-full justify-between rounded-xl border-border font-semibold text-xs h-11"
            >
              Voir la fiche complète
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="secondary" className="w-full justify-between rounded-xl font-semibold text-xs h-11">
              Modifier la demande
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </aside>
      )}
    </div>
  )
}
