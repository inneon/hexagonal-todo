# Abstractness, Instability and the 'Main sequence'

Back way-back-when Uncle Bob's book Clean Architecture described a set of 2 metrics and a sequence about how modules are comprised and how they interact. I have seen lots of literature about how this applies to Java, Python and .NET, but little in the JavaScript and Typescript world - something that is interesting to me as a primarily Typescript developer. The ideas are language agnostic only concerning itself with abstract grouping of code called modules. These could be npm packages, but the ideas will apply equally to dlls, jars, or even just groups of folders, etc.

I also wanted to revisit the idea since being introduced to Ports and Adaptors. My hypothesis is that P&A will naturally lend itself to code that produces metrics which fit favorably with the main sequence.

## The metrics

If you are already familiar with Abstractness, Instability and the Main sequence then feel free to jump to [the next section](#this-repository-and-its-metrics).

There are two metrics here: abstractness and instability. Each is given by a number in the range 0-1 (inclusive).

### Abstractness

Abstractness is the percentage of artifacts within a module that are 'abstract' in some way vs those that are concrete. For example, interfaces, abstract classes or type definitions, vs those that are concrete classes or collections of implementations. This is the one part where some nuance per language is required.

A module with only abstract code would have an abstraction metric of 1, and a module with only implementation would have a metric of 0.

### Instability

Instability is a little harder to intuit. It is basically a measure of how likely the functionality of a given module is likely to be changed (possibly inadvertently) based on how it is coupled, and is derived from 2 further sub-metrics:

- Outgoing coupling (also called efferent coupling) is the number of references within one module to any code (abstract or concrete) to another module.
- Incoming coupling (also called afferent coupling) is the converse - it is the number of reference that code is referenced within another module.

_(Note that in the majority of the literature Outgoing coupling is called efferent coupling and Incoming coupling is called afferent coupling. I really do not like these names because they sound so similar when spoken, and because afferent and efferent are so infrequently used that most people don't know what they mean - so I have just gone with Outgoing/Incoming.)_

In the example below if each line represents a single reference, `My Module` has an outgoing coupling of 3 (on `x`, `y` and `z`), and an incoming coupling of 2 (from `a` and `b`).

![Diagram showing 'My Module' with incoming coupling from A and B and outgoing coupling to X, Y and Z](./incomingOutgoingCoupling.png)

Instability for a module is the ratio of incoming to outgoing coupling, and is defined as

$$Instability = \frac{C_{out}}{C_{in} + C_{out}}$$

In the above example this is 3/(3+2) = 0.6 , so a medium instability. It shows how stable a module will be as a result of upstream changes. Modules with high instability will be more unstable due to changes upstream rippling out and affecting them. Conversely, modules with low instability are less likely to be affected by upstream changes. (It is important to note that 'high stability code' here doesn't necessarily mean code that is stable - that is with low churn - I think that it is just the case that naming things is hard.)

High instability _can_ make managing changes hard to code, reason about, and increase the testing area. Ultimately, some module(s) will be the root(s) of application(s) and so will have high instability - if some module has incoming coupling then the other end of that dependency must have outgoing coupling. High instability is not bad in itself, but is something to be aware of.

## The main sequence

Finally, we come to the main sequence. It is defined in terms of abstractness and instability: as a trailing diagonal along the space of combinations of these metrics, as well as some of the area either side (shown in green below). The claim in Clean Architecture is that: ideally modules should sit somewhere on or near to this sequence. Doing so will encourage us to rely more heavily on high stability code and have fewer dependencies on lower stability code.

![Graph of Instability vs Abstractness with main-sequence along the trailing diagonal](./MainSequenceGraph.png)

The Clean Architecture book also defines two other areas:

- The Zone of Uselessness (in blue above). Modules here are highly abstract (they don't do anything on their own), and is unstable with respect to changes (not much relies on it). This begs the question of why the module exists.
- The Zone of Pain (in red above). These modules are not very abstract (they have mainly concrete classes), and have low instability (they are relied on by a lot). Changes in these modules can have affects on many other modules and be painful to change.

These zones are more of a spectrum and indication rather than rigid classifications. The exact transition point does not strictly matter, but I have just mapped them out in a similar location to other literature.

The final metric that is defined is the distance from the main sequence. It is given by

$$ Dist = \lvert Abstractness + Instability - 1 \rvert $$

with a Distance of 0 being on the main sequence and 1 being right in one of the corners.

## This repository and its metrics

To test the hypothesis I cam up with the simplest repo I could: a Todo-App hosted in Express and with Persistence (in the loosest sense of the word) handled in memory with an associative map. The application is not close to a fully-fledged todo app and there are several key features missing (marking a todo as complete, for example), but I think this should at least give an indication.

This mono-repo uses a Ports and Adaptors style, and the modules that I will be concerned with are the main projects that make it up. They are:

- The domain library - i.e. the application domain logic, where all the domain logic is stored
- Driven ports library - type definitions for the ports that the domain uses
- Driven adaptors library - adaptors for driven ports that adapt between the domain and underlying technology (e.g. database/caching persistence)
- Driving ports library - type definitions services that the application offers
- Driving adaptors library - adaptors that driving ports that adapt between the presentation technology and the domain (e.g. REST API hosting)
- The application - glues together the domain with its backing technology

The diagram show which modules depend on which others:

![Standard ports and adaptors dependencies tree](./P&ADependencies.png)

### Metrics

This table shows the metrics for each of the modules, and the graph shows where they lie relative to the main sequence:

| Module           | Abstract artifacts | Concrete artifacts | Abstractness | Incoming coupling | Outgoing coupling | Instability | Distance |
| ---------------- | ------------------ | ------------------ | ------------ | ----------------- | ----------------- | ----------- | -------- |
| Application      | 0                  | 2                  | 0            | 0                 | 7                 | 1           | 0        |
| Domain           | 0                  | 2                  | 0            | 1                 | 7                 | 0.875       | 0.125    |
| Driving ports    | 3                  | 0                  | 1            | 5                 | 0                 | 0           | 0        |
| Driving adaptors | 0                  | 1                  | 0            | 1                 | 1                 | 0.5         | 0.5      |
| Driven ports     | 3                  | 0                  | 1            | 8                 | 0                 | 0           | 0        |
| Driven adaptors  | 0                  | 2                  | 0            | 2                 | 2                 | 0.5         | 0.5      |

![Metrics on main sequence graph of the numbers above](./MainSequenceWithModules.png)

## Analysis and thoughts

The first thing that I notice is quite how binary the abstractness metric is; all values are either 0 or 1. I think this is partly due to how simplistic my toy repo is - it is the first 'thing' that many TypeScript or JavaScript developers make and I really have not fleshed it out in any way. I assume that as more files and functionality get added the positions shift. If I evolve this repo then I will keep track of the history of these metrics.

On a positive note, the second thing that I noticed is that there is a general correlation of the modules and the main sequence. The Application, Driven- and Driving ports fit exactly on the line and in opposite corners. As above, I would expect some drift as an application gets more involved.

Interestingly both Driven- and Driving adaptors fall into the Zone of Pain. In my naivety I had not expected this. I have some thoughts having seen the results:

- Maybe the adaptors are genuinely painful. They represent the interface between the clean domain logic and the messy real world.
  - The [NDepends blog](https://blog.ndepend.com/abstractness-entering-zone-pain/) (a .NET tool for these metrics), suggests two ways of digging oneself out of the zone of pain: adding abstractness (e.g. more interfaces), and reducing the dependency footprint. Adding interfaces seems counter-productive when the reason the module exists is to provide concrete implementations of the ports. Similarly it is only depended on by the application so there is little chance to decrease this - so maybe it is where it is.
  - Much of the literature suggests the big pain for these modules is the pain of change. This definitely resonates with my experience of persistence parts of adaptors: while _adding_ a table or column to a database is simple, _altering_ an existing schema (and migrating the data) tends to be a lot more painful. I do not think I can solve that fundamental problem with a pretty little graph and some metrics.
- My adaptors are very simplistic. Maybe by the time that they include database libraries, HTTP calls to other services, and logging and monitoring libraries the instability gets increased and the modules find themselves closer to the main sequence. (Though, on the converse, maybe some other modules would get pushed into less favourable positions as they get fleshed out.)
  - Similarly, as the domain gets more complex it will require more complex ports, and therefore more complex adaptors implementing them. This will increase the outward coupling of the adaptors, while the inward coupling will remain relatively static due to the whole application neededing to be setup just once no matter how complex it is. This would also push the instability up.
- In general modules are much more likely to fall into the Zone of Pain than the Zone of Uselessness. Maybe some modules just fall there despite having well thought out modules.

However, 4 out of 6 modules did fall within a reasonable zone. I would say this is a success.

To me this is all unsurprising. The idea of having modules on the main sequence is an architectural pairing to the OOP idea of "rely on abstractions, not on concretes" (i.e. [the D in SOLID](https://medium.com/@inzuael/solid-dependency-inversion-principle-part-5-f5bec43ab22e)). Modules which are relied on are further down in the graph, and modules which have more abstractions are more right. The natural consequence of following the D at a module level would be to follow the main sequence. Ports and Adaptors is one architectural framework that will encourage this, and possibly push the abstractness metric to the extremes.

## Conclusions

Ports and Adaptors does seem to create modules that fall favourably close to the main sequence, at least for a simple repository. Assuming that falling within this zone is good (a discussion well outside this post) the Ports and Adaptors should help lead to well-structured code. The fact that modules fall towards the main sequence as a natural consequence of following Ports and Adaptors means that monitoring these metrics is not too important. By following a Ports and Adaptors pattern developers may get modules close to the main sequence for free.

The code for this blog post is hosted in [GitHub](https://github.com/inneon/hexagonal-todo).

## Criticisms

While I like Ports and Adaptors, and how they fit with the Main Sequence metrics I think there are some pitfalls to avoid:

1. In general reducing coupling is generally good - doing so makes it easier to trace how changes will affect outside modules. Whereas the stability metric only captures the percentages of incoming and outgoing coupling. Blindly following the main sequence encourages engineers to carefully balance incoming and outgoing dependencies where it might just be better to reduce dependencies and ignore these metrics.
2. In general I would also be careful adhering to the metrics too closely. I think if I as a developer had the metrics in mind while I was developing I may make choices based on the metrics instead of what I thought was genuinely was the best. E.g. if I was developing in the Driven adaptors package would I think to myself, "If I just make a xyz an interface instead of a simple class, then it would move slightly closer to the green area"?
3. Ports and Adaptors naturally hides some of the implicit coupling between the Domain and Driven adaptors. While there are no code links between the two, it is still possible to accidentally leak domain logic into the persistence. For example, putting a unique constraint on a column is a database functionality and would live in the Driven adaptor. Doing so may help the database to optimise queries, but developers would still need to be mindful to enforce uniqueness at the domain level and not delegate this logic to the adaptors. Forgetting to do so would leave the uniqueness constraint unenforced if the persistence layer would be changed. This type of coupling is not captured by Instability.
4. I don't know of any tools for collecting these metrics within a Javascript/Typescript project, though maybe that is for the best given point 2. In the example above I just counted by hand. Maybe a further blog post will focus on creating a NX plugin for measuring them.
