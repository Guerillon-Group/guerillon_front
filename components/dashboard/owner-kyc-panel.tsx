'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  BadgeCheck,
  Building,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Landmark,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useOwnerMutations } from '@/mutations/useOwnerMutations'
import { cn } from '@/lib/utils'

export function OwnerKycPanel() {
  const {
    loading,
    error,
    profile,
    documents,
    bankAccounts,
    requests,
    fetchOwnerOverview,
    saveOwnerProfile,
    uploadDocument,
    deleteDocument,
    addBankAccount,
    deleteBankAccount,
    createRequest,
  } = useOwnerMutations()

  // Form states
  const [profileFormOpen, setProfileFormOpen] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [idCardNumber, setIdCardNumber] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [address, setAddress] = useState('')

  const [docModalOpen, setDocModalOpen] = useState(false)
  const [docType, setDocType] = useState('title_deed')
  const [docName, setDocName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [bankModalOpen, setBankModalOpen] = useState(false)
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [swiftCode, setSwiftCode] = useState('')

  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [reqType, setReqType] = useState('mandate')
  const [reqSubject, setReqSubject] = useState('')
  const [reqMessage, setReqMessage] = useState('')

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchOwnerOverview()
  }, [fetchOwnerOverview])

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.company_name || '')
      setIdCardNumber(profile.id_card_number || '')
      setTaxNumber(profile.tax_number || '')
      setAddress(profile.address || '')
    }
  }, [profile])

  // Submit Profile KYC
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMsg(null)
    try {
      await saveOwnerProfile({
        company_name: companyName,
        id_card_number: idCardNumber,
        tax_number: taxNumber,
        address,
      })
      setProfileFormOpen(false)
      setFeedbackMsg({ type: 'success', text: 'Profil propriétaire mis à jour avec succès.' })
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Erreur lors de la sauvegarde du profil.' })
    }
  }

  // Upload Document
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setFeedbackMsg({ type: 'error', text: 'Veuillez sélectionner un fichier à téléverser.' })
      return
    }
    setFeedbackMsg(null)
    try {
      await uploadDocument({
        document_type: docType,
        name: docName || selectedFile.name,
        file: selectedFile,
      })
      setDocModalOpen(false)
      setDocName('')
      setSelectedFile(null)
      setFeedbackMsg({ type: 'success', text: 'Document transmis et en cours de vérification.' })
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Échec du téléversement du document.' })
    }
  }

  // Add Bank Account
  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bankName || !accountNumber || !accountName) {
      setFeedbackMsg({ type: 'error', text: 'Remplissez les champs obligatoires du compte bancaire.' })
      return
    }
    setFeedbackMsg(null)
    try {
      await addBankAccount({
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        swift_code: swiftCode,
        is_primary: bankAccounts.length === 0,
      })
      setBankModalOpen(false)
      setBankName('')
      setAccountName('')
      setAccountNumber('')
      setSwiftCode('')
      setFeedbackMsg({ type: 'success', text: 'Coordonnées bancaires ajoutées avec succès.' })
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Erreur lors de l’ajout du compte bancaire.' })
    }
  }

  // Create Request
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqSubject || !reqMessage) {
      setFeedbackMsg({ type: 'error', text: 'Saisissez le sujet et le message de votre demande.' })
      return
    }
    setFeedbackMsg(null)
    try {
      await createRequest({
        type: reqType,
        subject: reqSubject,
        message: reqMessage,
      })
      setRequestModalOpen(false)
      setReqSubject('')
      setReqMessage('')
      setFeedbackMsg({ type: 'success', text: 'Votre demande de mandat ou vérification a été soumise.' })
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Échec d’envoi de la demande.' })
    }
  }

  const kycStatus = profile?.status || 'pending'

  return (
    <div className="mt-8 flex flex-col gap-8">
      {feedbackMsg && (
        <div
          className={cn(
            'flex items-center gap-3 rounded-2xl p-4 text-xs font-semibold shadow-xs',
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200',
          )}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-red-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Overview Banner & Status Badge */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-white p-6 shadow-xs md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#16381e]/10 text-[#16381e]">
              <ShieldCheck className="size-7 text-[#c5a059]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-extrabold tracking-tight text-[#16381e]">
                  Vérification KYC & Dossier Propriétaire
                </h2>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold border',
                    kycStatus === 'verified'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : kycStatus === 'rejected'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200',
                  )}
                >
                  {kycStatus === 'verified' ? (
                    <>
                      <BadgeCheck className="size-3.5 fill-emerald-600 text-white" />
                      Vérifié & Certifié MBIYO
                    </>
                  ) : kycStatus === 'rejected' ? (
                    <>
                      <ShieldAlert className="size-3.5 text-red-600" />
                      Dossier à corriger
                    </>
                  ) : (
                    <>
                      <Clock className="size-3.5 text-amber-600 animate-spin" />
                      Vérification en cours
                    </>
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground max-w-2xl leading-relaxed">
                Renseignez vos identifiants fonciers et bancaires pour recevoir vos loyers, valider vos mandats de vente et garantir un titre sécurisé à vos acquéreurs.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setProfileFormOpen(!profileFormOpen)}
            variant="outline"
            size="sm"
            className="rounded-full border-[#16381e]/20 px-4 font-bold text-[#16381e] hover:bg-secondary shrink-0"
          >
            <UserCheck className="size-4 text-[#c5a059]" />
            {profileFormOpen ? 'Fermer le profil' : 'Éditer mes données KYC'}
          </Button>
        </div>

        {/* Profile Edit Form Drawer */}
        {profileFormOpen && (
          <form onSubmit={handleSaveProfile} className="mt-6 border-t border-border/60 pt-6">
            <h3 className="text-sm font-bold text-[#16381e] mb-4">Informations d'identité & Légales</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="company-name" className="block text-xs font-bold text-foreground mb-1">
                  Nom de la Société / Entité (optionnel)
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: Immobilière du Kivu SARL"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="id-card" className="block text-xs font-bold text-foreground mb-1">
                  Numéro Carte d'Identité / Passeport
                </label>
                <input
                  id="id-card"
                  type="text"
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                  placeholder="Ex: PP-84920492-CD"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="tax-number" className="block text-xs font-bold text-foreground mb-1">
                  Numéro d'Impôt / NIF
                </label>
                <input
                  id="tax-number"
                  type="text"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  placeholder="Ex: A-2940291-K"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="owner-address" className="block text-xs font-bold text-foreground mb-1">
                  Adresse Résidentielle Principale
                </label>
                <input
                  id="owner-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Karisimbi, Goma, RDC"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setProfileFormOpen(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                size="sm"
                className="rounded-full bg-[#16381e] px-6 text-xs font-bold text-white"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer le Profil'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Grid 2 Columns: Documents & Bank Accounts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* SECTION 1: DOCUMENTS KYC & TITRES FONCIERS */}
        <div className="flex flex-col rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="size-5 text-[#c5a059]" />
              <h3 className="font-display text-base font-bold text-[#16381e]">Titres & Pièces Justificatives</h3>
            </div>
            <Button
              onClick={() => setDocModalOpen(!docModalOpen)}
              size="xs"
              className="gap-1 rounded-full bg-[#16381e] px-3 text-[11px] font-bold text-white"
            >
              <Plus className="size-3" />
              Ajouter un document
            </Button>
          </div>

          {docModalOpen && (
            <form onSubmit={handleUploadDoc} className="mt-4 rounded-2xl bg-secondary/40 p-4 border border-border">
              <h4 className="text-xs font-bold text-[#16381e] mb-3">Téléverser une pièce justificative</h4>

              <div className="space-y-3">
                <div>
                  <label htmlFor="doc-type" className="block text-[11px] font-bold text-foreground mb-1">
                    Type de document
                  </label>
                  <select
                    id="doc-type"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full rounded-xl border border-input bg-white px-3 py-1.5 text-xs font-medium outline-none"
                  >
                    <option value="title_deed">Titre Foncier / Certificat d'enregistrement</option>
                    <option value="id_card">Carte d'Identité / Passeport</option>
                    <option value="tax_certificate">Attestation Fiscale / Quittance</option>
                    <option value="power_of_attorney">Procuration / Mandat notarié</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="doc-name" className="block text-[11px] font-bold text-foreground mb-1">
                    Nom du document (optionnel)
                  </label>
                  <input
                    id="doc-name"
                    type="text"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Ex: Titre Foncier Parcelle 480 - Himbi"
                    className="w-full rounded-xl border border-input bg-white px-3 py-1.5 text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="doc-file" className="block text-[11px] font-bold text-foreground mb-1">
                    Fichier (PDF, PNG, JPG - Max 10 Mo)
                  </label>
                  <input
                    id="doc-file"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-input bg-white px-3 py-1.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="xs" onClick={() => setDocModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !selectedFile}
                  size="xs"
                  className="rounded-full bg-[#16381e] px-4 font-bold text-white"
                >
                  <UploadCloud className="size-3 mr-1" />
                  {loading ? 'Téléversement...' : 'Transmettre'}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-5 flex flex-col divide-y divide-border/60">
            {documents.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Aucun document n'a été téléversé pour le moment.
              </p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-[#16381e]">
                      <FileText className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#16381e]">{doc.name}</h4>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        Type: {doc.document_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold border',
                        doc.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : doc.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200',
                      )}
                    >
                      {doc.status === 'approved' ? 'Approuvé' : doc.status === 'rejected' ? 'Rejeté' : 'En examen'}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteDocument(doc.id)}
                      className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 2: COORDONNÉES BANCAIRES & REVERSEMENT */}
        <div className="flex flex-col rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="size-5 text-[#c5a059]" />
              <h3 className="font-display text-base font-bold text-[#16381e]">Comptes Bancaires & RIB</h3>
            </div>
            <Button
              onClick={() => setBankModalOpen(!bankModalOpen)}
              size="xs"
              className="gap-1 rounded-full bg-[#16381e] px-3 text-[11px] font-bold text-white"
            >
              <Plus className="size-3" />
              Ajouter un RIB
            </Button>
          </div>

          {bankModalOpen && (
            <form onSubmit={handleAddBank} className="mt-4 rounded-2xl bg-secondary/40 p-4 border border-border">
              <h4 className="text-xs font-bold text-[#16381e] mb-3">Coordonnées de reversement des loyers/ventes</h4>

              <div className="space-y-3">
                <div>
                  <label htmlFor="bank-name" className="block text-[11px] font-bold text-foreground mb-1">
                    Nom de la Banque
                  </label>
                  <input
                    id="bank-name"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Ex: Rawbank, equity bcdc, TMB..."
                    className="w-full rounded-xl border border-input bg-white px-3 py-1.5 text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="account-name" className="block text-[11px] font-bold text-foreground mb-1">
                    Nom du Titulaire du Compte
                  </label>
                  <input
                    id="account-name"
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Ex: Sarah Mukendi"
                    className="w-full rounded-xl border border-input bg-white px-3 py-1.5 text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="account-num" className="block text-[11px] font-bold text-foreground mb-1">
                    Numéro de Compte / IBAN
                  </label>
                  <input
                    id="account-num"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Ex: 00018-0294029402-92"
                    className="w-full rounded-xl border border-input bg-white px-3 py-1.5 text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="swift" className="block text-[11px] font-bold text-foreground mb-1">
                    Code SWIFT / BIC (optionnel)
                  </label>
                  <input
                    id="swift"
                    type="text"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    placeholder="Ex: RAWBCCD3"
                    className="w-full rounded-xl border border-input bg-white px-3 py-1.5 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="xs" onClick={() => setBankModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  size="xs"
                  className="rounded-full bg-[#16381e] px-4 font-bold text-white"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer le RIB'}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-5 flex flex-col divide-y divide-border/60">
            {bankAccounts.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Aucun compte bancaire enregistré.
              </p>
            ) : (
              bankAccounts.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-[#16381e]">
                      <Building className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#16381e]">
                        {b.bank_name} {b.is_primary && <span className="text-[#c5a059]">(Principal)</span>}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {b.account_name} — N° {b.account_number}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteBankAccount(b.id)}
                    className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: DEMANDES DE MANDAT & SUPPORT PROPRIÉTAIRE */}
      <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-[#16381e]">Demandes de Mandat & Assistance</h3>
            <p className="text-xs text-muted-foreground">
              Demandez un suivi notarié, un mandat d'exclusivité ou l'évaluation de vos titres par les juristes MBIYO.
            </p>
          </div>
          <Button
            onClick={() => setRequestModalOpen(!requestModalOpen)}
            size="sm"
            className="gap-1 rounded-full bg-[#16381e] px-4 text-xs font-bold text-white shrink-0"
          >
            <Plus className="size-3.5" />
            Nouvelle Demande
          </Button>
        </div>

        {requestModalOpen && (
          <form onSubmit={handleCreateRequest} className="mt-4 rounded-2xl bg-secondary/40 p-4 border border-border">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="req-type" className="block text-xs font-bold text-foreground mb-1">
                  Type de requête
                </label>
                <select
                  id="req-type"
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value)}
                  className="w-full rounded-xl border border-input bg-white px-3 py-2 text-xs font-medium outline-none"
                >
                  <option value="mandate">Demande de Mandat Exclusif MBIYO</option>
                  <option value="verification">Vérification de Titre Foncier au Cadastre</option>
                  <option value="withdrawal">Relevé & Reversement de Loyers</option>
                  <option value="support">Assistance Juridique / Notariale</option>
                </select>
              </div>

              <div>
                <label htmlFor="req-subject" className="block text-xs font-bold text-foreground mb-1">
                  Sujet de la demande
                </label>
                <input
                  id="req-subject"
                  type="text"
                  value={reqSubject}
                  onChange={(e) => setReqSubject(e.target.value)}
                  placeholder="Ex: Mandat de vente Villa Kyeshero"
                  className="w-full rounded-xl border border-input bg-white px-3 py-2 text-xs font-medium outline-none"
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="req-message" className="block text-xs font-bold text-foreground mb-1">
                Message & Détails
              </label>
              <textarea
                id="req-message"
                rows={3}
                value={reqMessage}
                onChange={(e) => setReqMessage(e.target.value)}
                placeholder="Précisez votre demande, les références du bien ou vos disponibilités pour un rdv..."
                className="w-full rounded-xl border border-input bg-white px-3 py-2 text-xs font-medium outline-none"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setRequestModalOpen(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                size="sm"
                className="rounded-full bg-[#16381e] px-6 text-xs font-bold text-white"
              >
                {loading ? 'Envoi...' : 'Soumettre la Demande'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-col divide-y divide-border/60">
          {requests.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Aucune demande enregistrée. Soumettez une requête pour contacter le pôle juridique & gestion MBIYO.
            </p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="flex items-start justify-between py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#16381e]">{req.subject}</h4>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold capitalize text-muted-foreground">
                      {req.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xl">{req.message}</p>
                </div>

                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[10px] font-bold border shrink-0',
                    req.status === 'resolved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : req.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200',
                  )}
                >
                  {req.status === 'resolved'
                    ? 'Traitée'
                    : req.status === 'in_progress'
                      ? 'En cours'
                      : 'En attente'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
