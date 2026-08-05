import { supabase } from "@/lib/supabase";
import { Profile, Assessment, ActivityLog, AiEvaluation, AssessmentResult } from "@/types/database";

export interface DashboardDataPayload {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  assessments: Assessment[];
  assessmentResults: AssessmentResult[];
  overallHumanValueScore: number;
  recentActivities: ActivityLog[];
  latestAiEvaluation: AiEvaluation | null;
}

/**
 * Backend Data Layer for the Human Value Score Dashboard.
 * Queries Supabase PostgreSQL tables filtered strictly by auth.uid().
 */
export async function getDashboardData(providedUserId?: string): Promise<DashboardDataPayload> {
  let userId = providedUserId;
  let userEmail = "";

  if (!userId) {
    const { data: sessionData } = await supabase.auth.getSession();
    const authUser = sessionData.session?.user;
    if (authUser) {
      userId = authUser.id;
      userEmail = authUser.email || "";
    }
  }

  if (!userId) {
    return {
      user: null,
      profile: null,
      assessments: [],
      assessmentResults: [],
      overallHumanValueScore: 0,
      recentActivities: [],
      latestAiEvaluation: null,
    };
  }

  // Parallel Supabase queries — all filtered by user_id (RLS enforced)
  const [
    profileRes,
    assessmentsRes,
    resultsRes,
    activitiesRes,
    aiEvalRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("assessments").select("*").eq("user_id", userId).order("started_at", { ascending: false }),
    supabase.from("assessment_results").select("*").eq("user_id", userId).order("generated_at", { ascending: false }).limit(1),
    supabase.from("activity_logs").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    supabase.from("ai_evaluations").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const profile = profileRes.data as Profile | null;
  const assessments = (assessmentsRes.data || []) as Assessment[];
  const assessmentResults = (resultsRes.data || []) as AssessmentResult[];
  const recentActivities = (activitiesRes.data || []) as ActivityLog[];
  const latestAiEvaluation = (aiEvalRes.data as AiEvaluation) || null;

  // Calculate overall score from profile or latest assessment result
  const overallHumanValueScore =
    profile?.human_value_score ||
    (assessmentResults.length > 0 ? assessmentResults[0].overall_score : 0);

  return {
    user: {
      id: userId,
      email: userEmail || profile?.email || "",
    },
    profile,
    assessments,
    assessmentResults,
    overallHumanValueScore,
    recentActivities,
    latestAiEvaluation,
  };
}
