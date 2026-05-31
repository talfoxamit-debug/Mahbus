# Mahbus (محبوس) — a desktop game

A simple, friendly desktop version of **Mahbus** (also called *Mahbusa*, "the
imprisoned") — the Middle-Eastern cousin of backgammon. Built as one
self-contained file so it's easy to run for anyone, on any computer.

## How to play it (the easy way)

1. Download / copy the file **`mahbus.html`**.
2. **Double-click it.** It opens in your web browser (Chrome, Edge, Safari,
   Firefox — whatever you have). Nothing to install.
3. Pick **Play vs Computer** (play on your own) or **Two Players** (two people
   take turns on the same screen).

That's it. It works completely offline — no internet needed.

## How a turn works

- Press the big green **🎲 Roll the Dice** button.
- **Click a piece** you want to move. The squares you're allowed to move it to
  light up. **Click one** to move there. The matching die is used up.
- Move once for each die. Rolling a **double** (e.g. two 4s) gives you **four**
  moves.
- Made a mistake? Press **↩ Undo**.
- When you've used your dice, it's the other side's turn automatically.

## The rules (the trapping variant)

- Each side has **15 pieces**, all stacked in opposite far corners at the start.
  The two sides race in **opposite directions** toward their own home, then
  **bear the pieces off** the board. First to bear off all 15 **wins**.
- **The twist — "mahbus" means "imprisoned":** there is no bar. If you land on a
  point holding a **single** enemy piece, you sit on top and **trap** it
  (shown with a 🔒). A trapped piece is **frozen** and cannot move until you
  lift your piece(s) off it.
- A point held by **2 or more** enemy pieces is **blocked** — you can't land
  there.
- You can only **bear off** once **all** your pieces are in your home board (and
  none of your pieces are imprisoned).

## Notes

This is version 1, kept deliberately simple. A few things are intentionally left
out for now and are easy to add later: the doubling cube, gammon/backgammon
scoring, sound, and saving a game in progress. Regional house-rules vary
slightly; the rule logic lives in small, clearly-named functions in
`mahbus.html` so it can be adjusted if your family plays a different way.
