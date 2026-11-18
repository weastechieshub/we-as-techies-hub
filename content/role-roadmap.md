---
title: Engineer to AI Engineer to FDE / AI Architect
description: >-
  Follow one project from a plain web app to an agent platform. Each level takes the same
  system one step further on the Microsoft stack.
# The sections are the columns of the home page, left to right.
#   drawing   the picture above the section: web-app, agent-app, services, platform or beyond
#   tone      the section's accent colour: cyan, blue, orange, pink, green or yellow
#   flag      the job title you reach when the section is done (leave out for no flag)
# A skill is one block under the section.
#   icon      code, layers, cloud, database, user, network, check, shield, sparkles, book, box,
#             refresh, link, pin, compass or chart
#   part      where the block sits in the system stack: role, design, testing, layer, security,
#             operations or platform. Use it on every skill of a section, or on none.
#   group     puts skills in named boxes instead (used in Beyond)
#   lessons   the block lights up when it has lessons. Each lesson has a title and its links:
#             youtubeUrl, facebookUrl, linkedinUrl and labUrl. Write 'coming-soon' (or leave the
#             link out) while a link is not up yet.
sections:
  - id: base
    title: Software Engineering Base
    summary: 'Ship a real web app on Azure: a screen, an API and a database.'
    drawing: web-app
    tone: green
    flag: Engineer
    skills:
      - title: Programming basics
        icon: code
      - title: Full stack development
        icon: layers
      - title: Cloud and DevOps
        icon: cloud
      - title: Data engineering
        icon: database

  - id: level-1
    title: 'Level 1: Practitioner'
    summary: Build your first agent. It answers from company data, uses tools, and ships in a tested web app.
    drawing: agent-app
    tone: cyan
    skills:
      - title: Role skills
        icon: user
        part: role
      - title: System design
        icon: network
        part: design
      - title: Testing and evaluation
        icon: check
        part: testing
      - title: App development
        icon: code
        part: layer
      - title: Agents and tools
        icon: sparkles
        part: layer
      - title: Skills, context and knowledge
        icon: book
        part: layer
      - title: Foundry and models
        icon: box
        part: layer
        # The Read a Model Card series. No link is up yet, so every icon and the lab show as
        # coming soon. Replace 'coming-soon' with the lesson's own link when it is ready.
        lessons:
          - title: Parameters and model size
            youtubeUrl: 'coming-soon'
            facebookUrl: 'coming-soon'
            linkedinUrl: 'coming-soon'
            labUrl: 'coming-soon'
          - title: Tokens and the tokenizer
            youtubeUrl: 'coming-soon'
            facebookUrl: 'coming-soon'
            linkedinUrl: 'coming-soon'
            labUrl: 'coming-soon'
          - title: What tokens limit and cost
            youtubeUrl: 'coming-soon'
            facebookUrl: 'coming-soon'
            linkedinUrl: 'coming-soon'
            labUrl: 'coming-soon'
          - title: What goes in and comes out
            youtubeUrl: 'coming-soon'
            facebookUrl: 'coming-soon'
            linkedinUrl: 'coming-soon'
            labUrl: 'coming-soon'
          - title: What the model knows
            youtubeUrl: 'coming-soon'
            facebookUrl: 'coming-soon'
            linkedinUrl: 'coming-soon'
            labUrl: 'coming-soon'
          - title: Who stands behind it
            youtubeUrl: 'coming-soon'
            facebookUrl: 'coming-soon'
            linkedinUrl: 'coming-soon'
            labUrl: 'coming-soon'
          - title: What a benchmark measures
            youtubeUrl: 'coming-soon'
            facebookUrl: 'coming-soon'
            linkedinUrl: 'coming-soon'
            labUrl: 'coming-soon'
      - title: Data
        icon: database
        part: layer
      - title: Security and safety
        icon: shield
        part: security
      - title: DevOps and operations
        icon: refresh
        part: operations
      - title: Azure platform
        icon: cloud
        part: platform

  - id: level-2
    title: 'Level 2: Professional'
    summary: Take it to production as microservices, and grow from one agent to several.
    drawing: services
    tone: blue
    flag: AI Engineer
    skills:
      - title: Role skills
        icon: user
        part: role
      - title: System design
        icon: network
        part: design
      - title: Testing and evaluation
        icon: check
        part: testing
      - title: App development
        icon: code
        part: layer
      - title: Agents and tools
        icon: sparkles
        part: layer
      - title: Skills, context and knowledge
        icon: book
        part: layer
      - title: Foundry and models
        icon: box
        part: layer
      - title: Data
        icon: database
        part: layer
      - title: Security and safety
        icon: shield
        part: security
      - title: DevOps and operations
        icon: refresh
        part: operations
      - title: Azure platform
        icon: cloud
        part: platform

  - id: level-3
    title: 'Level 3: Expert'
    summary: Build the platform many teams ship agents on, at enterprise scale, with custom models.
    drawing: platform
    tone: pink
    flag: FDE / AI Architect
    skills:
      - title: Role skills
        icon: user
        part: role
      - title: System design
        icon: network
        part: design
      - title: Testing and evaluation
        icon: check
        part: testing
      - title: App development
        icon: code
        part: layer
      - title: Agents and tools
        icon: sparkles
        part: layer
      - title: Skills, context and knowledge
        icon: book
        part: layer
      - title: Foundry and models
        icon: box
        part: layer
      - title: Data
        icon: database
        part: layer
      - title: Security and safety
        icon: shield
        part: security
      - title: DevOps and operations
        icon: refresh
        part: operations
      - title: Azure platform
        icon: cloud
        part: platform

  - id: beyond
    title: 'Beyond: FDE and AI Architect'
    summary: 'Go further: build for customers as an FDE, or guide many teams as an AI Architect.'
    drawing: beyond
    tone: orange
    skills:
      - title: Integration engineering
        icon: link
        group: FDE
      - title: Customer delivery and field skills
        icon: pin
        group: FDE
      - title: 'Architecture practice: reviews, standards and decisions'
        icon: compass
        group: AI Architect
      - title: AI adoption and business value
        icon: chart
        group: AI Architect
      - title: Agents in business applications
        icon: sparkles
        group: AI Architect
---

The role roadmap shown on the home page. Add a lesson under a skill and that block lights up.
