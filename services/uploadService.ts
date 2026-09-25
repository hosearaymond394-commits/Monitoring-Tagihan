import { SupportingDocumentKey } from "@/types/billing";

/**
 * Document storage abstraction. For now this keeps files only in the
 * browser's memory (via the File object handed to uploadDocument) and
 * never actually persists anything server-side — it does NOT claim the
 * file is stored in the cloud. Swap the implementation for one backed by
 * Google Cloud Storage (using STORAGE_BUCKET from .env.example) once that
 * backend exists; callers only depend on this interface.
 */
export interface UploadResult {
  key: SupportingDocumentKey;
  fileName: string;
  storedRemotely: false; // always false until a real backend is wired up
}

export const UploadService = {
  async uploadDocument(key: SupportingDocumentKey, file: File): Promise<UploadResult> {
    console.log("[UploadService] (mock) received file for", key, file.name);
    // NOTE: no network/storage call happens here yet.
    return { key, fileName: file.name, storedRemotely: false };
  },
  async getDocument(_billingId: string, _key: SupportingDocumentKey): Promise<null> {
    console.log("[UploadService] (mock) getDocument called — no storage backend configured");
    return null;
  },
  async deleteDocument(_billingId: string, _key: SupportingDocumentKey): Promise<{ deleted: boolean }> {
    console.log("[UploadService] (mock) deleteDocument called — no storage backend configured");
    return { deleted: false };
  }
};
