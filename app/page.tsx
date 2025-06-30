"use client"

import { AgentApiState, AgentRequestBuildParams, CORTEX_ANALYST_TOOL, CORTEX_SEARCH_TOOL, DATA_TO_CHART_TOOL, SQL_EXEC_TOOL, useAgentAPIQuery } from "@/lib/agent-api";
// import { useAccessToken } from "@/lib/auth";
import { Messages } from "./components/messages";
import { ChatInput } from "./components/input";
import { ChatHeader } from "./components/chat-header";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

export default function Home() {
  // Agent API requires a JWT auth token. For simplicity we are using an api to fetch this,
  // but this can be easily replaced with a login layer and session management
  // const { token: jwtToken } = useAccessToken();
  const jwtToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBNTcyNTg0MjY3ODk2MS1TT0ZUV0FSRU9ORV9QQVJUTkVSLkhJTEFMX1IuU0hBMjU2OlZvNkhIZ3crLzMxVTM3WCtEUHJHK1BYZTIzWlRocUZxOWR4K1lyb0RzWXM9Iiwic3ViIjoiQTU3MjU4NDI2Nzg5NjEtU09GVFdBUkVPTkVfUEFSVE5FUi5ISUxBTF9SIiwiaWF0IjoxNzUxMjE0ODU0LCJleHAiOjE3NTEyMTg0NTR9.dQsBFQQt-gvWeWPFS76cV7VnG1kVITE68PVw0O1nnxbyfd04QaKJ2tB2o_wMLpaFSrqmq68deHxL-HEWd1A4orNjotmYnoZt5x-E57kczjjslX1sEI14syt_eHZgM9Pz7EZSg9p1HpIOa8Ldh5nsUbxvspis_RdaBplwuegnaYHzy5SIn4oBCjrjRLXX7AaK0NP6d0yp_8_1knY5kfhTeEylZMEZ9jrtJejXdrV-jhGl9isFul3oL7w5CAMua17fsopXzUC35Vl3S9e9CYbjgWcKQXqGM6SBGUjchKNWgLKCmKFnSk1Qj2U6GJUF0t2f7HnPGpxjj7-R5xIcKzy3gQ";

  const tools: AgentRequestBuildParams['tools'] = [
    CORTEX_SEARCH_TOOL,
    CORTEX_ANALYST_TOOL,
    DATA_TO_CHART_TOOL,
    SQL_EXEC_TOOL,
  ]

  const { agentState, messages, latestAssistantMessageId, handleNewMessage } = useAgentAPIQuery({
    authToken: jwtToken,
    snowflakeUrl: process.env.NEXT_PUBLIC_SNOWFLAKE_URL!,
    experimental: {
      EnableRelatedQueries: true,
    },
    tools,
    toolResources: {
      "analyst1": { "semantic_model_file": process.env.NEXT_PUBLIC_SEMANTIC_MODEL_PATH },
      "search1": { "name": process.env.NEXT_PUBLIC_SEARCH_SERVICE_PATH, max_results: 10 }
    }
  })

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader />

        <Messages
          agentState={agentState}
          messages={messages}
          latestAssistantMessageId={latestAssistantMessageId}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <ChatInput
            isLoading={agentState !== AgentApiState.IDLE}
            messagesLength={messages.length}
            handleSubmit={handleNewMessage} />
        </form>
      </div>
    </>
  );
}
