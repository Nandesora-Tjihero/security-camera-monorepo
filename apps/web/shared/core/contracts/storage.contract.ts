export interface IStorageService {
  uploadImage(
    userId: string,
    imageData: Blob | Uint8Array | ArrayBuffer
  ): Promise<string>;

  getImageUrl(userId: string, imageName: string): Promise<string>;
}
