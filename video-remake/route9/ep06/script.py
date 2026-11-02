"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 6, "Headlights".

Beat format: (scene, role, text, hold, overlay). Roles: narrator, dani (looping CB recording).
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "HEADLIGHTS")
END_TEXT = "EPISODE 7 COMING SOON"

BEATS = [
    ("door_keys", "narrator", "Rule five says move only at dawn. You break it at three fifteen AM.", 1.2,
     ("time", "DAY 10 - 3:15 AM")),
    ("lot_walk", "narrator", "The pickup is forty steps away. You count every one.", 1.6, None),
    ("cab", "narrator", "The cab smells like pine air freshener, and something worse. You don't look at the seat.",
     1.0, None),
    ("truck_bed", "narrator", "Three empty gas cans in the back. Dani has a car. The car needs gas.", 1.0, None),
    ("breaker", "narrator", "The pumps need power. Power means the breaker. The breaker means light.", 1.0, None),
    ("breaker", "narrator", "You flip one switch. Pumps. Only pumps.", 1.2, None),
    ("pump_on", "narrator", "Pump four wakes up with a beep that sounds like a gunshot.", 1.2, None),
    ("heads_turn", "narrator", "Out on the highway, heads turn.", 1.6, None),
    ("filling", "narrator", "Three cans. Ninety seconds each. The longest four and a half minutes of your life.", 1.2,
     ("count", "3", "GAS CANS")),
    ("coming", "narrator", "They're coming for the little glowing screen. Slow. Then not slow.", 1.0, None),
    ("yank", "narrator", "You don't finish the third can.", 1.0, None),
    ("ignition", "narrator", "The engine catches. And the headlights come on by themselves.", 1.0, None),
    ("faces", "narrator", "Every face on Route 9 turns toward you.", 1.4, None),
    ("drive_through", "narrator", "You drive. You don't brake. You don't look.", 1.4, None),
    ("drive_through", "narrator", "Something hits the fender. Then something else. The truck doesn't stop. "
                                  "Neither do you.", 1.2, None),
    ("mile_signs", "narrator", "Mile one twenty-eight. One twenty-nine.", 1.2, None),
    ("motel", "narrator", "The Starlight Motel. Its sign is dark. Of course it is. Dani follows the rules.", 1.2, None),
    ("room12", "narrator", "Room twelve. The door is open.", 1.0, None),
    ("room_inside", "narrator", "Inside, the beds are made. Two backpacks by the door. No Dani. No Milo.", 1.2, None),
    ("cb_bed", "dani", "Meet us at dawn. We'll watch for your headlights. Meet us at dawn.", 1.0, None),
    ("recorder", "narrator", "A tape recorder. Taped to the microphone. Playing Dani's voice. On a loop.", 1.4, None),
    ("doorway", "narrator", "Somebody wanted you to drive here. With your headlights on.", 1.4, None),
    ("convoy", "narrator", "Out on the highway, more headlights. A lot more.", 1.0, None),
    ("convoy", "narrator", "And the dead don't drive.", 2.4, None),
    ("end", None, "", 3.5, None),
]
