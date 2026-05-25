import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rows = [
  ["Polarity", "Original wording", "Rename rationale", "Gist", "Bucket", "Status / Notes"],
  ["Making It Happen vs Letting It Unfold", "Making things happen vs Letting things happen", "I kept your core idea but changed \"letting things happen\" to \"letting it unfold\" because it sounds less passive. It better captures receptivity, timing, signals, and allowing reality or other people to participate.", "This is the tension between agency and receptivity. At its best, making things happen helps us act with courage and intention; letting things unfold helps us listen for timing, signals, and the participation of other people or reality itself.", "Action", "Recommended core"],
  ["Speaking Up vs Staying Quiet", "Speaking up vs Keeping silent", "This is a light rename. \"Staying quiet\" feels a little warmer and more intentional than \"keeping silent,\" which can sound suppressed or punitive.", "This polarity asks when our voice is needed and when restraint is wiser. Speaking up can protect truth, values, and clarity; staying quiet can preserve relationship, make room for others, or keep us from turning every thought into a contribution.", "Action", "Recommended core"],
  ["Starting Now vs Seeing the Whole Plan", "Getting started vs having the whole plan; Perfection vs getting started; Knowing the full purpose vs knowing enough to get started", "I collapsed several related candidates into one clearer polarity about movement and preparation. I chose this phrasing because it avoids making one side sound obviously virtuous and lets both sides have dignity.", "This is the tension between learning through movement and learning through preparation. Starting now generates momentum and information; seeing the whole plan can prevent avoidable harm, wasted effort, or a rush down the wrong path.", "Action", "Recommended core"],
  ["Doing vs Being", "Doing vs not doing (being?)", "This is mostly cleanup. \"Being\" gives the second pole a positive identity rather than defining it only as the absence of action.", "This polarity sits underneath busyness, rest, productivity, and purpose. Doing lets us shape the world and move commitments forward; being lets us replenish, listen, metabolize experience, and remember that not everything valuable is produced.", "Action", "Recommended core"],
  ["Planning vs Spontaneity", "Spontaneity vs planning", "This one is mostly unchanged. I put planning first only because it pairs naturally with later workplace/leadership applications, but either order works.", "This is the tension between structure and aliveness. Planning creates reliability, care, and follow-through; spontaneity preserves freshness, responsiveness, and the possibility of being surprised by life.", "Action", "Recommended core"],
  ["Present Moment vs Future Direction", "Present moment vs future; Length vs width; Planning for the future", "I consolidated the present/future cluster into a cleaner, more flexible title. \"Future direction\" is broader than planning and includes meaning, orientation, and what life is adding up to.", "This is about living fully now while still orienting toward what life is adding up to. Presence keeps the current moment from becoming merely a means to an end; future direction helps our days cohere into a life we recognize as ours.", "Action", "Recommended core"],
  ["Persistence vs Release", "Keep at it vs give up", "\"Give up\" sounds like failure, while \"release\" can be wise, discerning, and healthy. This rename makes the second pole more legitimate, which is important for a true polarity.", "This polarity asks when to keep going and when to let go. Persistence helps us stay with difficulty long enough for growth, mastery, or commitment to matter; release helps us stop investing in what is no longer alive, wise, or ours to carry.", "Action", "Recommended core"],
  ["Prioritizing vs Staying Open", "Prioritizing (saying no) vs being open to possibilities; Flexibility vs rigidity", "I merged these because they seem to point to focus versus possibility. \"Staying open\" is more positive than \"not prioritizing,\" and \"prioritizing\" is more precise than \"rigidity.\"", "This is the tension between focus and possibility. Prioritizing protects our attention and makes meaningful progress possible; staying open keeps us from becoming rigid, over-optimized, or blind to emergent opportunities.", "Action", "Recommended core"],
  ["Adding vs Subtracting", "Accumulation phase vs editing phase; Add vs subtract", "I collapsed these into the simplest reader-facing version. The accumulation/editing language can still appear inside the article as a more creative explanation.", "This is the movement between accumulation and editing. Adding brings richness, options, and creative raw material; subtracting brings clarity, elegance, and the discipline to make the essential visible.", "Action", "Recommended core"],
  ["Knowing What You Know vs Beginner's Mind", "Owning what you know, but being open to what you don't; Beginner's mind vs expert", "I merged the two related notes. This title keeps both confidence and humility visible, and avoids making \"expert\" sound like the problem.", "This polarity holds confidence and humility together. Owning what you know allows you to contribute, teach, and lead; beginner's mind keeps you curious, teachable, and available to information that does not fit your current frame.", "Perspective", "Recommended core"],
  ["Proper Scale vs Inflated Importance", "Playing small vs self-importance", "This was the biggest rename. The original title makes both poles sound negative, while the piece itself is really about neither disappearing nor inflating. \"Proper scale\" better captures the desired discernment.", "Proper scale asks us to neither disappear nor inflate: to recognize that we matter deeply in some places, not everywhere, and that wisdom includes knowing when to take up space and when to make room.", "Perspective", "Recommended core"],
  ["Ease vs Worthwhile Difficulty", "Hardship vs ease", "I added \"worthwhile\" because not all difficulty is meaningful or growth-producing. This helps protect the piece from accidentally romanticizing hardship.", "This polarity explores our relationship with friction. Ease can be a sign of alignment, flow, or good design; difficulty can be the necessary wind that strengthens us, though not all hardship is noble or worth enduring.", "Perspective", "Recommended core"],
  ["Seeing What Is vs Seeing What Could Be", "Seeing things as they are and seeing the potential in them", "This is a light reader-facing cleanup. It keeps your meaning but makes the title shorter and more elegant.", "This is the tension between acceptance and imagination. Seeing what is helps us stay grounded in reality; seeing what could be lets us participate in repair, growth, and transformation without denying the present.", "Perspective", "Recommended core"],
  ["Enoughness vs Improvement", "As you are vs self improvement; Wanting things to be better vs being okay as they are", "I collapsed these because they seem to name the same inner tension. \"Enoughness\" gives the acceptance side more warmth and philosophical weight than \"being okay as they are.\"", "This polarity asks how we can be whole now and still grow. Enoughness protects us from turning life into an endless self-improvement project; improvement honors the real desire to learn, heal, build, and become more capable.", "Perspective", "Recommended core"],
  ["Strength vs Vulnerability", "Strength vs vulnerability", "No meaningful rename. This one already reads clearly and has strong existing resonance.", "This is the tension between steadiness and openness. Strength helps us hold boundaries, responsibility, and pressure; vulnerability keeps us reachable, honest, and connected to our own humanity and the humanity of others.", "Perspective", "Recommended core"],
  ["Joy vs Seriousness", "Joy vs seriousness", "No meaningful rename. This title is already clear, accessible, and inviting.", "This polarity is about whether we meet life with gravity, delight, or both. Seriousness honors what matters, especially in difficult times; joy keeps us from mistaking heaviness for depth and reminds us that aliveness is also part of wisdom.", "Perspective", "Recommended core"],
  ["Grief vs New Possibility", "Grieving vs seeing the opportunity (ending vs beginning)", "I softened \"seeing the opportunity\" because it can sound too quick or instrumental in the face of loss. \"New possibility\" leaves more room for tenderness and timing.", "This polarity appears in endings, transitions, and losses. Grief honors what was real and what cannot simply be reframed away; new possibility helps us notice what may be beginning without rushing past sorrow.", "Perspective", "Recommended core"],
  ["Head vs Heart", "Head vs heart", "No meaningful rename. This one is simple and widely understood.", "This is the tension between analysis and felt knowing. The head helps us reason, sequence, and test assumptions; the heart helps us sense meaning, care, values, and the human cost of a choice.", "Perspective", "Recommended core"],
  ["The World Is Broken vs The World Is Beautiful", "The world is fucked up / The world is beautiful", "I made this more public-facing while preserving the force of the idea. \"Broken\" is less jarring than the original phrasing but still emotionally honest.", "This may be one of the anchoring polarities of the whole project. Seeing brokenness keeps us honest and responsive to suffering; seeing beauty keeps us from collapsing into despair and helps us continue to love the world we are trying to serve.", "Perspective", "Recommended core"],
  ["Simplicity vs Mess", "Simplicity vs mess", "No meaningful rename. This one is vivid and useful as-is.", "This polarity helps readers understand that clarity often arrives through complexity, not by avoiding it. Mess can be generative, honest, and necessary for growth; simplicity can be the hard-won coherence on the other side of wrestling with the real material.", "Perspective", "Recommended core"],
  ["Individual Needs vs Collective Needs", "Individual vs collective", "I added \"needs\" to make the lived tension clearer. It moves the title from abstract categories toward choices people actually feel.", "This is the tension between selfhood and belonging. Honoring the individual protects agency, dignity, and difference; honoring the collective reminds us that our choices ripple through families, teams, communities, and systems.", "Relations", "Recommended core"],
  ["Self-Care vs Care for Others", "Self care vs care for others", "No meaningful rename beyond punctuation. This is already clear and practical.", "This polarity is closely related to individual vs collective, but more intimate and embodied. Self-care keeps service from becoming depletion or resentment; care for others keeps self-care from becoming isolation, indulgence, or avoidance of responsibility.", "Relations", "Recommended core"],
  ["Staying in Relationship vs Creating Distance", "Staying in conversation/relationship vs cutting someone off", "\"Cutting someone off\" can sound harsh or morally loaded. \"Creating distance\" includes boundaries, protection, and separation without assuming the action is reactive or wrong.", "This is the tension between repair and protection. Staying in relationship allows for dialogue, complexity, and the possibility of change; creating distance can be necessary when contact becomes harmful, diminishing, or no longer honest.", "Relations", "Recommended core"],
  ["Compassion vs Accountability", "Holding people to high standards vs knowing when they need slack; Compassion vs accountability", "I consolidated these because they point to the same relational leadership tension. \"Compassion vs Accountability\" is the clearest and most familiar version for coaching/workplace readers.", "This polarity asks how we hold people with both kindness and standards. Compassion remembers context, pain, and human limitation; accountability honors impact, responsibility, and the need for repair or change.", "Relations", "Recommended core"],
  ["Task Focus vs Relationship Focus", "Added from the source/background reading rather than directly from your list", "This is highly relevant to leaders and teams, and it fits your audience well.", "Task focus helps people deliver, decide, and move work forward; relationship focus builds trust, commitment, and the human conditions that make sustained work possible.", "Relations", "Possible addition"],
  ["Independence vs Collaboration", "Inferred from individual/collective examples and comments about going alone vs bringing the group along", "I separated it because individual/collective can be values-based, while independence/collaboration is often about how work gets done.", "Independence brings speed, ownership, and clarity of personal direction; collaboration brings shared intelligence, belonging, and outcomes no one could have created alone.", "Relations", "Possible addition"],
  ["Growth vs Efficiency", "Added from leadership polarity literature", "It is more organizational than some of your current list, so I marked it as a possible addition rather than core.", "Growth expands reach, possibility, and ambition, while efficiency protects sustainability, discipline, and stewardship. Overusing either side can produce bloat or stagnation.", "Leadership / Workplace", "Possible addition"],
  ["Change vs Stability", "Added from leadership polarity literature and common organizational life", "This may be useful for clients navigating uncertainty, transition, or institutional change.", "Change allows adaptation, renewal, and responsiveness to reality. Stability gives people continuity, trust, and enough ground beneath their feet to absorb change without becoming overwhelmed.", "Leadership / Workplace", "Possible addition"],
  ["Control vs Empowerment", "Added as a leadership coaching polarity; echoes making/letting in a manager/team context", "It is highly relevant to leadership coaching and gives the action polarity a concrete organizational application.", "Control can create consistency, risk management, and coordination. Empowerment creates ownership, motivation, and local intelligence, especially when people closest to the work need room to act.", "Leadership / Workplace", "Possible addition"],
  ["Short-Term Needs vs Long-Term Investment", "Added from leadership polarity literature and workplace reality", "It overlaps a little with present/future, but is more strategic and organizational.", "Short-term needs ask what must be handled now. Long-term investment asks what future we are creating or neglecting through today's choices, especially when urgency crowds out what matters but is not yet loud.", "Leadership / Workplace", "Possible addition"],
  ["Rest vs Rejuvenation", "Rest vs rejuvenation", "I treated this as part of Doing vs Being, though it could become its own piece if you want something specifically about energy renewal.", "", "Action", "Collapsed / left out for now"],
  ["Engagement vs Detachment", "Engagement vs detachment", "I left this out for now because it needs more definition; it could become a strong Perspective or Relations polarity once the poles are clearer.", "", "Perspective / Relations", "Left out for now"],
  ["Courage vs Prudence", "Courage vs bravado", "I left this out because courage vs bravado feels more like a distinction between virtue and distortion than a true polarity. Courage vs Prudence might make it work as a true polarity.", "", "Perspective", "Potential rename / left out for now"],
  ["Human Earthliness vs Something Bigger", "Being human on this earth vs being something bigger", "I left this out because it feels potentially profound but not yet concrete enough for the first recommended list.", "", "Perspective", "Left out for now"],
  ["What vs How", "What vs how", "I left this out because the gist is not yet clear enough from the notes, though the bus driver/USPS example sounds promising.", "", "Perspective / Action", "Left out for now"],
  ["Emotional Containment vs Emotional Expression", "Tamping things down vs letting them take over", "I left this out because it likely needs a more positive name for both sides. Emotional Containment vs Emotional Expression might be a more workable formulation.", "", "Perspective / Relations", "Potential rename / left out for now"],
];

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Polarity List");
sheet.getRange(`A1:F${rows.length}`).values = rows;

sheet.getRange("A1:F1").format = {
  fill: { color: "#1F4E5F" },
  font: { bold: true, color: "#FFFFFF" },
  alignment: { horizontal: "center", vertical: "middle", wrapText: true },
};
sheet.getRange(`A2:F${rows.length}`).format = {
  alignment: { vertical: "top", wrapText: true },
};

sheet.getRange("A:A").columnWidth = 230;
sheet.getRange("B:B").columnWidth = 290;
sheet.getRange("C:C").columnWidth = 420;
sheet.getRange("D:D").columnWidth = 440;
sheet.getRange("E:E").columnWidth = 150;
sheet.getRange("F:F").columnWidth = 170;

const notes = workbook.worksheets.add("Notes");
notes.getRange("A1:B5").values = [
  ["Field", "Description"],
  ["Polarity", "Recommended reader-facing title."],
  ["Original wording", "Closest source wording from the project doc, or note if added/inferred."],
  ["Rename rationale", "Why the recommended title differs from the original wording."],
  ["Status / Notes", "Whether the item is core, a possible addition, or left out/collapsed for now."],
];
notes.getRange("A1:B1").format = {
  fill: { color: "#1F4E5F" },
  font: { bold: true, color: "#FFFFFF" },
};
notes.getRange("A:B").format = { alignment: { vertical: "top", wrapText: true } };
notes.getRange("A:A").columnWidth = 180;
notes.getRange("B:B").columnWidth = 600;

const outDir = "/Users/hank/Projects/polarities/outputs/polarity_sheet_build";
await fs.mkdir(outDir, { recursive: true });

const inspect = await workbook.inspect({
  kind: "table",
  range: `Polarity List!A1:F${rows.length}`,
  include: "values",
  tableMaxRows: 8,
  tableMaxCols: 6,
});
console.log(inspect.ndjson);

await workbook.render({ sheetName: "Polarity List", range: "A1:F12", scale: 1 });

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outDir}/polarity_working_list.xlsx`);
console.log(`${outDir}/polarity_working_list.xlsx`);
