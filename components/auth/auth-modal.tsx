'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, AlertCircle, Mail, Phone, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useAuthMutations } from '@/mutations/useAuthMutations'
import { useAuthStore } from '@/stores/useAuthStore'

export type AuthModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

declare global {
  interface Window {
    google?: any
  }
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [countryCode, setCountryCode] = useState('+243')
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input')
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    loading,
    error,
    loginMutation,
    verifyOtpMutation,
    resendOtpMutation,
    googleLoginMutation,
  } = useAuthMutations()

  const user = useAuthStore((state) => state.user)

  // Charger le script Google Identity Services (GIS) dynamique
  useEffect(() => {
    if (typeof window === 'undefined') return
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!window.google && clientId) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [])

  // Déclencher la connexion avec Google
  const handleGoogleLogin = async () => {
    setErrorMessage(null)
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (window.google?.accounts?.oauth2 && clientId) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.access_token) {
            try {
              await googleLoginMutation(tokenResponse.access_token)
              setStep('success')
              setTimeout(() => {
                onOpenChange(false)
                setStep('input')
              }, 1500)
            } catch (err: any) {
              setErrorMessage(err?.message || 'Échec de la connexion avec Google.')
            }
          }
        },
      })
      client.requestAccessToken()
    } else {
      // Prompt d'intégration pour test / fallback si Client ID non configuré
      const testToken = prompt(
        "Veuillez saisir votre token Google OAuth pour tester l'authentification (ou configurez NEXT_PUBLIC_GOOGLE_CLIENT_ID dans .env) :"
      )
      if (testToken) {
        try {
          await googleLoginMutation(testToken)
          setStep('success')
          setTimeout(() => {
            onOpenChange(false)
            setStep('input')
          }, 1500)
        } catch (err: any) {
          setErrorMessage(err?.message || 'Erreur lors de la validation du token Google.')
        }
      } else {
        setErrorMessage('La configuration Google OAuth (NEXT_PUBLIC_GOOGLE_CLIENT_ID) est requise.')
      }
    }
  }

  // Soumission du formulaire Email / Téléphone
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      if (method === 'email') {
        const fullEmail = email.trim()
        if (password) {
          // Connexion directe par mot de passe
          await loginMutation({ email: fullEmail, password })
          setStep('success')
          setTimeout(() => {
            onOpenChange(false)
            setStep('input')
          }, 1500)
        } else {
          // Demande de code OTP par email
          await resendOtpMutation({ email: fullEmail })
          setStep('otp')
        }
      } else {
        // Le contrat API actuel n'expose qu'un OTP e-mail (`email` est obligatoire).
        // Ne pas envoyer un numéro de téléphone dans ce champ : cela créait une
        // fausse tentative de connexion et une erreur de validation côté serveur.
        setErrorMessage('La connexion par SMS n’est pas encore disponible. Utilisez votre adresse e-mail.')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Une erreur est survenue lors de la connexion.')
    }
  }

  // Vérification du code OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    const code = otpCode.join('')

    if (code.length < 6) {
      setErrorMessage('Veuillez saisir le code complet à 6 chiffres.')
      return
    }

    try {
      const targetEmail = method === 'email' ? email : `${countryCode}${phone}`
      await verifyOtpMutation({ email: targetEmail, code })
      setStep('success')
      setTimeout(() => {
        onOpenChange(false)
        setStep('input')
      }, 1500)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Code OTP invalide ou expiré.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] overflow-hidden rounded-3xl border-border/80 bg-white p-0 shadow-2xl">
        {/* Header Visual avec Bannière MBIYO */}
        <div className="bg-[#16381e] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 size-48 rounded-full bg-[#c5a059]/10 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white p-1 shadow-sm">
              <Image
                src="/logo-mbiyo.svg"
                alt="Logo Mbiyo"
                width={36}
                height={36}
                className="size-full object-contain"
              />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold tracking-tight text-white">
                MBIYO REAL-ESTATE
              </DialogTitle>
              <DialogDescription className="text-xs text-emerald-100/80">
                Espace sécurisé pour Acheteurs, Agents & Propriétaires
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Message d'erreur s'il y en a un */}
          {(errorMessage || error?.message) && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage || error?.message}</span>
            </div>
          )}

          {step === 'input' && (
            <div className="flex flex-col gap-5">
              {/* Bouton de Connexion Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border/80 bg-white py-3 px-4 text-sm font-semibold text-foreground transition-all hover:bg-secondary/60 hover:shadow-xs active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Connexion Google...' : 'Continuer avec Google'}</span>
              </button>

              {/* Séparateur */}
              <div className="relative flex items-center justify-center">
                <span className="w-full border-t border-border/80" />
                <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  ou avec identifiant
                </span>
              </div>

              {/* Sélecteur de méthode (Email / Téléphone) */}
              <div className="flex rounded-xl bg-secondary/80 p-1">
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all',
                    method === 'email'
                      ? 'bg-white text-[#16381e] shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Mail className="size-3.5" />
                  Adresse E-mail
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all',
                    method === 'phone'
                      ? 'bg-white text-[#16381e] shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Phone className="size-3.5" />
                  Téléphone SMS
                </button>
              </div>

              {/* Formulaire de saisie */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {method === 'email' ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Adresse e-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="exemple@mbiyo.com"
                          className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Mot de passe <span className="text-muted-foreground font-normal">(Optionnel si OTP)</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-border/80 bg-white py-2.5 px-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Numéro de téléphone
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="rounded-2xl border border-border/80 bg-white px-2 py-2.5 text-xs font-bold text-[#16381e] outline-none"
                      >
                        <option value="+243">RDC +243</option>
                        <option value="+257">Burundi +257</option>
                        <option value="+250">Rwanda +250</option>
                        <option value="+33">France +33</option>
                        <option value="+1">USA/Can +1</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="81 234 56 78"
                          className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-11 w-full gap-2 rounded-2xl bg-[#16381e] text-white hover:bg-[#16381e]/90 font-bold text-sm shadow-md shadow-[#16381e]/20"
                >
                  {loading ? (
                    <span>Traitement en cours...</span>
                  ) : (
                    <>
                      <span>{password ? 'Se connecter' : 'Recevoir le code OTP'}</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="size-3.5 text-[#c5a059]" />
                Vos données sont chiffrées & sécurisées selon la politique MBIYO.
              </p>
            </div>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 py-2">
              <div className="text-center">
                <h3 className="font-display text-lg font-bold text-[#16381e]">Code de sécurité envoyé</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Saisissez le code à 6 chiffres transmis à{' '}
                  <span className="font-bold text-foreground">
                    {method === 'email' ? email : `${countryCode} ${phone}`}
                  </span>
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value
                      const next = [...otpCode]
                      next[idx] = val
                      setOtpCode(next)
                      if (val && e.target.nextElementSibling) {
                        ;(e.target.nextElementSibling as HTMLInputElement).focus()
                      }
                    }}
                    className="size-11 rounded-xl border border-border/90 text-center font-display text-lg font-bold text-[#16381e] focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/20 outline-none"
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-2xl bg-[#16381e] text-white hover:bg-[#16381e]/90 font-bold text-sm"
              >
                {loading ? 'Vérification...' : 'Valider & Accéder à MBIYO'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-center text-xs font-semibold text-muted-foreground hover:text-foreground underline"
              >
                Changer de méthode de connexion
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#16381e]/10 text-[#16381e]">
                <CheckCircle2 className="size-8 text-[#c5a059]" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-[#16381e]">
                Connexion Réussie !
              </h3>
              <p className="text-xs text-muted-foreground">
                Bienvenue {user?.name ? `${user.name}` : ''} sur votre espace MBIYO REAL-ESTATE.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
