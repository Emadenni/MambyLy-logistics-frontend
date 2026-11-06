import React from "react";
import { Composition, staticFile } from "remotion";
import { Reel, type ReelProps, type Script, type Timeline } from "./Reel";
import { Story, type StoryProps, type StoryScript } from "./Story";

const load = async <T,>(path: string): Promise<T> => (await fetch(staticFile(path))).json();

/** The copione and the recording of `name` (render.mjs copies the copione into public/<name>/). */
export const Root: React.FC = () => (
  <>
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={540}
    defaultProps={{ name: "reel-navigazione" } as ReelProps}
    calculateMetadata={async ({ props }) => {
      const script = await load<Script>(`${props.name}/script.json`);
      const timeline = await load<Timeline>(`${props.name}/timeline.json`);
      const frames = Math.round((script.beats * 60 * script.fps) / script.bpm);
      return { durationInFrames: frames, fps: script.fps, props: { ...props, script, timeline } };
    }}
  />
  <Composition
    id="Story"
    component={Story}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={1020}
    defaultProps={{ name: "reel-storia" } as StoryProps}
    calculateMetadata={async ({ props }) => {
      const own = await load<StoryScript & { recording?: string }>(`${props.name}/script.json`);
      const recording = own.recording ?? own.id;
      const takes = (await load<StoryScript>(`${recording}/script.json`)).takes;
      const timelines = Object.fromEntries(await Promise.all(takes.map(async (t) => [t.id, await load(`${recording}/${t.id}/timeline.json`)] as const)));
      const script = { ...own, takes };
      return { durationInFrames: Math.round((own.beats * 60 * own.fps) / own.bpm), fps: own.fps, props: { ...props, recording, script, timelines } as StoryProps };
    }}
  />
  </>
);
