"use client"

import { AgentApiState, AgentRequestBuildParams, CORTEX_ANALYST_TOOL, CORTEX_SEARCH_TOOL, DATA_TO_CHART_TOOL, SQL_EXEC_TOOL, useAgentAPIQuery } from "@/lib/agent-api";
import { useAccessToken } from "@/lib/auth";
import { Messages } from "./components/messages";
import { ChatInput } from "./components/input";
import { ChatHeader } from "./components/chat-header";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

export default function Home() {
  // Agent API requires a JWT auth token. For simplicity we are using an api to fetch this,
  // but this can be easily replaced with a login layer and session management
  // const { token: jwtToken } = useAccessToken();
  const jwtToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBNTcyNTg0MjY3ODk2MS1TT0ZUV0FSRU9ORV9QQVJUTkVSLkhJTEFMX1IuU0hBMjU2OlZvNkhIZ3crLzMxVTM3WCtEUHJHK1BYZTIzWlRocUZxOWR4K1lyb0RzWXM9Iiwic3ViIjoiQTU3MjU4NDI2Nzg5NjEtU09GVFdBUkVPTkVfUEFSVE5FUi5ISUxBTF9SIiwiaWF0IjoxNzUxMjA4OTUwLCJleHAiOjE3NTEyMTI1NTB9.ScBd83lyCbYGq_EORTbAYiYLUpE1DQoxN1av_QUta1BZZUq1eAzS8gP77BZ_GZePxaFhJjB6-7lbDK4pO0-B08BzVjNqSJrcN2-xZc_9sq9gEh5HWPw3j6t7Kl-ZcIxNLxBUiW9dyWfLtIxYxt4t5j2fxVZSDZ4lMdh-sDQP7d3FYXCN19FQqsn4MUyyts5-xmkAyxHGOT39zesmWcQL5XZvwetDlb9GJyCNObK_tMY8tFIeluMQl5M5On5xdVwBhZDxK_t_E-Xb3NMCHPwFlhluIrYfsM7VCsuhroXpuV4Sa0nVO07Juld2WjGnReZT00MF7GYkTovkmHcI2oPwTQ";
  

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
