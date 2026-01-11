export function formatStoriesResponse(json) {
  if (!json) return "";

  const L = (s = "") => `${s}\n`;
  const divider = () => L("─".repeat(80));

  let out = "";

  // Header
  out += divider();
  out += L("📦 RESPONSE");
  out += divider();

  // Input summary
  out += L("\n🧾 INPUT SUMMARY");
  out += L("-".repeat(80));
  out += L(json.input_summary || "(none)");

  const stories = Array.isArray(json.stories) ? json.stories : [];
  out += L("\n📚 USER STORIES");
  out += L("-".repeat(80));
  out += L(`Total stories: ${stories.length}`);

  // Story blocks
  stories.forEach((s, idx) => {
    out += L("\n" + "=".repeat(80));
    out += L(`Story ${idx + 1}: ${s.story_id || "(no id)"} — ${s.title || ""}`);
    out += L("=".repeat(80));

    out += L(`As a     : ${s.as_a ?? ""}`);
    out += L(`I want   : ${s.i_want ?? ""}`);
    out += L(`So that  : ${s.so_that ?? ""}`);
    out += L("");
    out += L("Description:");
    out += L(`  ${s.description ?? ""}`);
    out += L("");

    out += L(`Priority : ${s.priority ?? ""}`);
    out += L(`Status   : ${s.status ?? ""}`);
    out += L(`Created  : ${s.created_on ?? ""}`);

    // Acceptance Criteria
    const ac = Array.isArray(s.acceptance_criteria) ? s.acceptance_criteria : [];
    out += L("\nAcceptance Criteria:");
    if (ac.length === 0) {
      out += L("  - (none)");
    } else {
      ac.forEach((a) => {
        out += L(`  - ${a.id ?? ""} [${a.priority ?? ""}]  ${a.description ?? ""}`);
      });
    }

    // Optional lists
    const printList = (label, arr) => {
      out += L(`\n${label}:`);
      if (!Array.isArray(arr) || arr.length === 0) out += L("  - (none)");
      else arr.forEach((x, i) => out += L(`  - ${i + 1}. ${typeof x === "string" ? x : JSON.stringify(x)}`));
    };

    printList("Tasks", s.tasks);
    printList("Dependencies", s.dependencies);
    printList("Risks", s.risks);

    // Metadata (compact)
    const metaKeys = s.metadata && typeof s.metadata === "object" ? Object.keys(s.metadata) : [];
    out += L("\nMetadata:");
    out += metaKeys.length ? L(JSON.stringify(s.metadata, null, 2)) : L("  (empty)");
  });

  out += L("\n" + divider());
  out += L("✅ End of response");
  out += divider();

  return out;
}