export function formatSize(size: number): string {
  for (const unit of ["B", "KB", "MB", "GB", "TB"]) {
    if (size < 1024) {
      return `${size.toFixed(2)} ${unit}`;
    }
    size /= 1024;
  }
  return "-- --";
}
