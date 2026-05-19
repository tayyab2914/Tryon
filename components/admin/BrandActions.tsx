"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  deleteBrandAction,
  resendBrandVerificationAction,
  verifyBrandEmailAction,
} from "@/app/actions/admin";

interface BrandActionsProps {
  brandId: string;
  brandName: string;
  emailVerified: boolean;
}

export function BrandActions({ brandId, brandName, emailVerified }: BrandActionsProps) {
  const [resent, setResent] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!emailVerified && (
        <>
          <form action={verifyBrandEmailAction}>
            <input type="hidden" name="brandId" value={brandId} />
            <Button type="submit" variant="secondary" size="sm">
              Mark email verified
            </Button>
          </form>
          <form
            action={resendBrandVerificationAction}
            onSubmit={() => setResent(true)}
          >
            <input type="hidden" name="brandId" value={brandId} />
            <Button type="submit" variant="secondary" size="sm">
              {resent ? "Verification sent" : "Resend verification"}
            </Button>
          </form>
        </>
      )}
      <form
        action={deleteBrandAction}
        onSubmit={(e) => {
          if (
            !window.confirm(
              `Delete "${brandName}"? This permanently removes the brand and all of its try-ons and domains. This cannot be undone.`,
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="brandId" value={brandId} />
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-control border border-danger px-3 text-sm font-medium text-danger transition-colors hover:bg-danger hover:text-canvas"
        >
          Delete brand
        </button>
      </form>
    </div>
  );
}
