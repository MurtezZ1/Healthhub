# Udhëzuesi i Zhvillimit dhe Kontributit (CONTRIBUTING)

Mirësevini në projektin **Healthhub**. Për të ruajtur standardet e këtij ekosistemi *Enterprise*, ju lutemi ndiqni praktikat e mëposhtme me rigorozitet gjatë programimit.

## 1. Versionimi Semantik (Semantic Versioning - SemVer)
Çdo Release i ri duhet të ndjekë formatin `MAJOR.MINOR.PATCH` (psh `v1.4.2`):
- **MAJOR:** Ndryshime rrënjësore arkitekturore ose të papërputhshme me të vjetrat.
- **MINOR:** Karakteristika (features) të reja që nuk prishin funksionalitetet ekzistuese.
- **PATCH:** Rregullime të vogla të gabimeve (Bug Fixes).

## 2. Metodologjia Agile & GitOps
Ky projekt menaxhohet përmes praktikave të shkathëta (Agile):
- Asnjë kod nuk çohet (deploy) direkt në prodhim me dorë. Gjithçka duhet të kalojë përmes `Git`.
- Përdorni degë (branches) të dedikuara për çdo feature, p.sh: `feature/add-patient-dashboard` ose `bugfix/fix-login-error`.
- Bëni Push degën dhe hapni një **Pull Request (PR)** drejt degës `main`.

## 3. Pair Programming dhe Code Review
- **Code Reviews janë TË DETYRUESHME:** Asnjë Pull Request nuk mund të bëhet Merge pa u kontrolluar të paktën nga 1 anëtar tjetër i ekipit.
- Për algoritme të ndërlikuara (psh Data Mining / ML), rekomandohet fuqimisht **Pair Programming** (dy inxhinierë në një ekran) për të rritur cilësinë e logjikës.

## 4. Cilësia e Kodit (Static Code Analysis)
- Sigurohuni që kodi juaj nuk ka thyer asnjë rregull në **SonarQube**.
- Serveri lokal SonarQube mund të aksesohet në `localhost:9000` pasi të ngrihet Docker-compose. Mos bëni commit kodin nëse ai tregon "Code Smells" ose "Security Vulnerabilities" të nivelit Kritik!
