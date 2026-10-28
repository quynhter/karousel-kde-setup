# Third-party code and local changes

Karousel 0.17 and Geometry Change 1.5 are by Peter Fajdiga, licensed under GPLv3 as declared in their package metadata. Original author and license metadata are retained inside the installation archives embedded in setup_karousel.py. Their complete upstream source snapshots, including build files and license notices, are in vendor/. SOURCES.json records pinned upstream commits, source URLs and SHA-256 hashes.

- https://github.com/peterfajdiga/karousel/tree/v0.17
- https://github.com/peterfajdiga/kwin4_effect_geometry_change/tree/v1.5

The generated Karousel JavaScript is modified for a fixed output, primary-output window admission, offscreen column parking and disabled upstream default shortcuts. primary-screen.patch contains all changes to the bundled JavaScript. Local changes were prepared on 2026-10-28 for this setup. This is an independent adaptation, not an official release by the upstream author.

The installer, local changes and documentation in this repository are distributed under GNU GPL version 3. See LICENSE. The Geometry Change implementation is unmodified; the installer configures its duration to 200 ms.
