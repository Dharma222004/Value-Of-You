export type EventType =
  | 'login'
  | 'logout'
  | 'page_view'
  | 'button_click'
  | 'assessment_started'
  | 'assessment_completed'
  | 'assessment_paused'
  | 'assessment_resumed'
  | 'report_downloaded'
  | 'recommendation_viewed'
  | 'profile_updated'
  | 'settings_updated';

export interface EventMetadata {
  method?: string;
  page?: string;
  module?: string;
  score?: number;
  duration?: number;
  buttonId?: string;
  recommendationId?: string;
  field?: string;
  [key: string]: any;
}

export interface TrackEventPayload {
  event: EventType;
  metadata?: EventMetadata;
  page?: string;
  user_id?: string;
}

export interface UserAgentDetails {
  browser: string;
  device: string;
  os: string;
}
