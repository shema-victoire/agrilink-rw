<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Keep the bundled NISR JSON as the sole source of displayed price insights because the hackathon prototype must be deterministic and work without network access.
- Use URL search parameters for crop and district selection because ranked findings should deep-link directly into a reproducible detail view.
- Keep `/` as the public intro and `/overview` as the ranked analysis because the product needs a minimal entry screen before the data views.
- Keep theme selection as a document-level class persisted in browser storage so appearance changes never alter route or selector state.
