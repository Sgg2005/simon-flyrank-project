# WORKFLOW.md comparing lazy and  precise prompts

## Setup
in round 1 (lazy-prompt), I used provided a genric one-sentence prompt:
"Build a settings form

in round 2 (precise-prompt), I used a more detailed prompt which included specifying fields, validation 
library, accessibility requirements, example error messages, 
and a request to write and run tests.

## Correctness
The first round created a validated form that stored data in localStorage, 
however, did not describe how the validation worked and did not have any tests.
The second round utilized a real Zod schema with explicit validations 
(name should be 2-50 characters long, email should be valid), 
and this was verified by 4 passing automated tests.

## Accessibility
In Round 1, all the HTML tags were correct (form, fieldset, legend), 
but no additional steps were taken in terms of making screen readers 
able to interpret that there is an error. In Round 2,
a couple of small ARIA attributes have been introduced to link error messages and input fields. 
Therefore, the error will be heard, rather than only seen.

## Edge Cases
For Round 1, there was no way that I could verify if it was capable of dealing 
with any bad data because there were no tests, and I would have had to do it manually. 
However, Round 2 contained tests that included verifying if it could validate empty fields, 
invalid email address, and submit button being disabled until all fields were completed.

## Review Effort
Round 1 did not require much planning ahead of time, although I did have to
look at the code for myself in order to understand what it was doing, and
I was not sure about the effectiveness of validation, because there were
no tests. Round 2 required more time for writing the prompt, but because it included
the tests which successfully passed, I was more sure of the outcome and
did not need to check anything on my own.
**Something I noticed:** Even in case of having a well-formulated prompt,
Cursor was able to create the form and the tests, however it did not
automatically incorporate the form into App.jsx. Instead, it notified me
that I needed to do that step on my own.g 

## Conclusion
Round 2 took longer to write the prompt, but I felt much more confident
in the result since the tests already showed it worked. Round 1 was much more
quicker to write, but I could not be sure it actually worked without testing
it myself. The lesson I learnt is that when you spend more time on the prompt
with tests bulit in saves time later, since you do not have to double-check
everything by hand.