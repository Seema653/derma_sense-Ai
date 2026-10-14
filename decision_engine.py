"""Explainable, rule-based wellness recommendations for DermaSense AI 2.0.

This module does not call an external LLM or diagnose medical conditions.
Recommendations are transparent rules based on user-selected preferences and
visual observations returned by the image-analysis module.
"""
from __future__ import annotations


def _text(value):
    if value is None:
        return ""
    if isinstance(value, (list, tuple, set)):
        return ", ".join(str(item).strip() for item in value if str(item).strip())
    return str(value).strip()


def generate_recommendation(
    skin_type,
    concern,
    budget,
    lifestyle,
    observations=None,
    weather=None,
):
    """Return unique, explainable suggestions in the UI's expected schema."""
    skin = _text(skin_type).casefold()
    issue = _text(concern).casefold()
    budget_level = _text(budget).casefold()
    habits = _text(lifestyle).casefold()
    observations = observations if isinstance(observations, (list, tuple)) else []
    weather = weather if isinstance(weather, dict) else {}

    recommendations = []
    seen = set()

    def add(title, reason, priority="medium"):
        key = title.casefold()
        if key not in seen:
            seen.add(key)
            recommendations.append({
                "title": title,
                "reason": reason,
                "priority": priority,
            })

    skin_rules = {
        "oily": ("Lightweight Routine", "Your selected skin type is oily; consider lightweight, non-comedogenic products."),
        "dry": ("Moisturization", "A gentle cleanser and regular moisturizer may support skin comfort."),
        "combination": ("Balanced Routine", "Consider a simple routine that accommodates both oilier and drier areas."),
        "sensitive": ("Gentle Routine", "Prefer fragrance-free options when suitable and introduce new products one at a time."),
        "normal": ("Maintain a Simple Routine", "A consistent gentle cleanse, moisturize and daytime sun-protection routine may help."),
    }
    if skin in skin_rules:
        title, reason = skin_rules[skin]
        add(title, reason, "high")

    concern_rules = {
        "oiliness": ("Avoid Over-Cleansing", "Use gentle cleansing rather than repeatedly stripping the skin."),
        "dryness": ("Consistent Moisturization", "Apply a suitable moisturizer consistently, especially after washing."),
        "redness": ("Keep Products Gentle", "Avoid introducing several new products at once; persistent redness warrants professional advice."),
        "pigmentation": ("Daytime Sun Protection", "Regular broad-spectrum sun protection can help limit additional sun-related darkening."),
        "acne": ("Gentle Acne-Aware Routine", "Avoid picking spots and choose products labelled non-comedogenic when suitable."),
        "acne / breakouts": ("Gentle Acne-Aware Routine", "Avoid picking spots and choose products labelled non-comedogenic when suitable."),
        "uneven texture": ("Simple Consistent Routine", "Keep a gentle routine; visible texture alone cannot identify its cause."),
        "general care": ("Daily Skin Basics", "Keep the routine simple: gentle cleansing, moisturizer and daytime sun protection."),
        "sensitivity": ("Patch Test New Products", "Introduce new products gradually and stop if irritation develops."),
    }
    if issue in concern_rules:
        title, reason = concern_rules[issue]
        add(title, reason, "high" if issue in {"redness", "dryness", "sensitivity"} else "medium")

    observation_rules = (
        (("shine",), "Lightweight Hydration", "The image module reported shine-like visible areas; lighting and camera conditions can affect this signal."),
        (("redness",), "Gentle Skincare", "The image module reported redness-like visible areas; this is a visual observation, not a diagnosis."),
        (("texture",), "Simple Consistent Routine", "The image module reported texture-like visible variation; the image cannot determine its cause."),
        (("dark",), "Sun Protection", "The image module reported darker visible areas; image lighting can affect this observation."),
    )
    for observation in observations:
        text = _text(observation).casefold()
        for keywords, title, reason in observation_rules:
            if any(word in text for word in keywords):
                add(title, reason)
                break

    def number(key):
        try:
            value = float(weather.get(key, 0) or 0)
            return value if value >= 0 else 0
        except (TypeError, ValueError):
            return 0

    if number("uv_index") >= 6:
        add("High UV Awareness", "The supplied UV index is elevated; consider shade, protective clothing and broad-spectrum sunscreen.", "high")
    if number("temperature") >= 32:
        add("Heat-Aware Routine", "The supplied temperature is high; seek shade and stay hydrated.", "medium")
    if number("humidity") >= 75:
        add("Humid Weather", "The supplied humidity is high; choose comfortable, lightweight products if preferred.", "medium")

    if budget_level == "low":
        add("Keep Routine Affordable", "Prioritize a few essentials and compare price per amount.")
    elif budget_level in {"medium", "flexible", "high"}:
        add("Compare Product Suitability", "Compare ingredients, product suitability and current prices before purchasing.")

    if any(term in habits for term in ("busy", "stress", "poor sleep", "low water", "junk food", "fast food", "sugary")):
        add("Choose One Manageable Habit", "Choose a realistic habit to work on, such as a consistent sleep schedule or regular water breaks.")
    else:
        add("Maintain Healthy Habits", "Aim for consistent sleep, balanced meals, hydration and activity where possible.")

    return recommendations
