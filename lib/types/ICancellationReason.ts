export type ICancellationReason =
    | "3d_secure_failed"
    | "call_issuer"
    | "canceled_by_merchant"
    | "card_expired"
    | "country_forbidden"
    | "deal_expired"
    | "expired_on_capture"
    | "expired_on_confirmation"
    | "fraud_suspected"
    | "general_decline"
    | "identification_required"
    | "insufficient_funds"
    | "internal_timeout"
    | "invalid_card_number"
    | "invalid_csc"
    | "issuer_unavailable"
    | "payment_method_limit_exceeded"
    | "payment_method_restricted"
    | "permission_revoked"
    | "unsupported_mobile_operator";
