import type { ReactNode } from "react";
import { toast } from "sonner";
import type { ourFileRouter } from "~/app/api/uploadthing/core";
import { UploadDropzone } from "~/lib/uploadthing";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export function FileUpload({ onChange, endpoint }: FileUploadProps): ReactNode {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(response) => {
        onChange(response?.[0].url);
      }}
      onUploadError={(error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
}
