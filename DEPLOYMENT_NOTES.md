# Deployment notes

If Vercel says it cannot find `pages` or `app`, the repository root is wrong.

Correct GitHub root:

```text
app/
components/
lib/
public/
package.json
```

Incorrect root:

```text
some-parent-folder/
  app/
  package.json
```

If you keep a parent folder, set Vercel > Project Settings > Build and Deployment > Root Directory to that folder name.
