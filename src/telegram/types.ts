export type TgUser = {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export type TgChat = {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

export type TgFileBase = {
  file_id: string;
  file_unique_id?: string;
  file_size?: number;
};

export type TgPhoto = TgFileBase & {
  width?: number;
  height?: number;
};

export type TgDocument = TgFileBase & {
  file_name?: string;
  mime_type?: string;
};

export type TgVideo = TgFileBase & {
  file_name?: string;
  mime_type?: string;
  width?: number;
  height?: number;
  duration?: number;
};

export type TgVoice = TgFileBase & {
  mime_type?: string;
  duration?: number;
};

export type TgAudio = TgFileBase & {
  file_name?: string;
  mime_type?: string;
  duration?: number;
};

export type TgReplyMessage = {
  message_id: number;
};

export type TgMessage = {
  message_id: number;
  date?: number;
  business_connection_id?: string;
  from?: TgUser;
  sender_chat?: TgChat;
  chat: TgChat;
  text?: string;
  caption?: string;
  photo?: TgPhoto[];
  document?: TgDocument;
  video?: TgVideo;
  voice?: TgVoice;
  audio?: TgAudio;
  reply_to_message?: TgReplyMessage;
};

export type BusinessConnection = {
  id: string;
  user: TgUser;
  user_chat_id: number;
  date: number;
  rights?: {
    can_reply?: boolean;
    [key: string]: boolean | undefined;
  };
  is_enabled: boolean;
};

export type BusinessMessagesDeleted = {
  business_connection_id: string;
  chat: TgChat;
  message_ids: number[];
};

export type Update = {
  update_id: number;
  message?: TgMessage;
  business_connection?: BusinessConnection;
  business_message?: TgMessage;
  edited_business_message?: TgMessage;
  deleted_business_messages?: BusinessMessagesDeleted;
};

export type TelegramApiResponse<T> = {
  ok: boolean;
  result: T;
  description?: string;
};