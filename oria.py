import os

IGNORED_DIRS = {
    ".git", "__pycache__", "node_modules",
    ".venv", "dist", "build"
}

def build_tree(root_path, indent=""):
    items = sorted(os.listdir(root_path))
    tree = []

    for i, item in enumerate(items):
        full_path = os.path.join(root_path, item)
        is_last = (i == len(items) - 1)

        prefix = "└── " if is_last else "├── "
        next_indent = "    " if is_last else "│   "

        # Пропускаємо технічні папки
        if item in IGNORED_DIRS:
            continue

        tree.append(indent + prefix + item)

        # Якщо це директорія — рекурсивно додаємо
        if os.path.isdir(full_path):
            tree.extend(build_tree(full_path, indent + next_indent))

    return tree


def main():
    root = os.getcwd()  # поточна директорія
    tree = build_tree(root)

    output_file = "project_tree.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(tree))

    print(f"\n✅ Структура проєкту згенерована в: {output_file}\n")

    # Автоматично відкриваємо файл
    if os.name == "nt":
        os.startfile(output_file)
    elif os.name == "posix":
        try:
            os.system(f"open '{output_file}'")     # macOS
        except:
            os.system(f"xdg-open '{output_file}'")  # Linux


if __name__ == "__main__":
    main()
