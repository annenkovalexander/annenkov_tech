const TELEGRAM_LINK_REGEXP = /^https:\/\/t\.me\/[A-Za-z0-9_]{5,32}$/i

export const isTelegramLink = (tgLink: string | undefined): tgLink is string => 
    Boolean(tgLink && TELEGRAM_LINK_REGEXP.test(tgLink))