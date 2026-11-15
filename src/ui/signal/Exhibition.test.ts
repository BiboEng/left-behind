// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DEFAULT_EXHIBIT_TITLE, useSignal } from "../../state/signal";
import Exhibition from "./Exhibition";

let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.history.replaceState(null, "", "/#signal/exhibit");
  useSignal.setState({ chapter: "exhibit", cards: ["ranger"], title: DEFAULT_EXHIBIT_TITLE, caption: "" });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

it("replaces an earlier copied result with truthful fallback feedback when a later copy is denied", async () => {
  const writeText = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("Permission denied"));
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  await act(async () => root.render(createElement(Exhibition)));
  const copy = container.querySelector<HTMLButtonElement>(".exhibit-actions button")!;

  await act(async () => copy.click());
  expect(copy.textContent).toContain("Exhibition link copied");
  expect(container.querySelector(".share-fallback")).toBeNull();

  await act(async () => copy.click());
  expect(copy.textContent).toContain("Copy exhibition link");
  expect(container.querySelector('[role="status"]')?.textContent).toContain("Automatic copying is unavailable");
  const fallback = container.querySelector<HTMLInputElement>(".share-fallback input")!;
  expect(fallback.value).toBe(writeText.mock.calls[1][0]);
  await act(async () => container.querySelector<HTMLButtonElement>(".share-fallback button")!.click());
  expect(document.activeElement).toBe(fallback);
  expect(fallback.selectionStart).toBe(0);
  expect(fallback.selectionEnd).toBe(fallback.value.length);
});
