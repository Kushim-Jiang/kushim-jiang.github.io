---
layout: home
title: Homepage
permalink: /
---

<div class="frame">
    <div class="quiz-container" id="quiz-container">
        <h4 id="question">Please refresh this page</h4>
        <div id="options"></div>
    </div>
</div>

<style>
    .frame {
        padding: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .quiz-container {
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 60vw;
        text-align: center;
    }

    .option {
        padding: 10px;
        margin: 5px 0;
        border-radius: 5px;
        cursor: pointer;
    }

    .option.correct {
        background-color: lightgreen;
    }

    .option.incorrect {
        background-color: lightcoral;
    }
</style>

<script>
    const questions = [
        {question: "What is a writing system in which only consonants are indicated?", options: ["Abjad", "Alphabet", "Abugida", "Logosyllabary"], answer: "Abjad"},
        {question: "What is a unit of information used for the organization, control, or representation of textual data?", options: ["Abstract Character", "Glyph", "Code Point", "Grapheme"], answer: "Abstract Character"},
        {question: "What is an ordered sequence of one or more abstract characters?", options: ["Abstract Character Sequence", "Combining Character Sequence", "Escape Sequence", "Mongolian Variation Sequence"], answer: "Abstract Character Sequence"},
        {question: "What is a writing system in which consonants are indicated by the base letters that have an inherent vowel, and other vowels are indicated by additional distinguishing marks modifying the base letter?", options: ["Abjad", "Alphabet", "Abugida", "Logosyllabary"], answer: "Abugida"},
        {question: "What is a mark placed above, below, or to the side of a character to alter its phonetic value?", options: ["Accent Mark", "Nonspacing Mark", "Enclosing Mark", "Vowel Mark"], answer: "Accent Mark"},
        {question: "What denotes letters or numbers by the first letter of their name, such as Greek acrophonic numerals?", options: ["Acrophonic", "Polytonic", "Perispomeni", "Prosgegrammeni"], answer: "Acrophonic"},
        {question: "What term, derived from the first and last letters of the traditional ordering of Sanskrit letters, refers to a letter in general in Sanskrit grammar?", options: ["Aksara", "Virama", "Candrabindu", "Anusvara"], answer: "Aksara"},
        {question: "What term is used in a broad sense in the Unicode Standard to mean the logical description of a process used to achieve a specified result?", options: ["Algorithm", "Bidirectional Display", "Localization", "Symmetric Swapping"], answer: "Algorithm"},
        {question: "What is a writing system in which both consonants and vowels are indicated?", options: ["Abjad", "Alphabet", "Abugida", "Logosyllabary"], answer: "Alphabet"},
        {question: "What is the informative property of the primary units of alphabets and/or syllabaries?", options: ["Alphabetic Property", "Directionality Property", "Ideographic Property", "Mathematical Property"], answer: "Alphabetic Property"},
        {question: "What is the association of secondary textual content with a point or range of the primary text?", options: ["Annotation", "Case Mapping", "Encoded Character", "Tagging"], answer: "Annotation"},
        {question: "What is the collection of conventions used by editors to annotate and comment on text?", options: ["Annotation", "Apparatus Criticus", "Conformance", "Core Specification"], answer: "Apparatus Criticus"},
        {question: "What is the forms of decimal digits used in most parts of the Arabic world?", options: ["Arabic-Indic Digits", "Indic Digits", "European Digits", "Mayan Numerals"], answer: "Arabic-Indic Digits"},
        {question: "What is an abstract character that has a code point assigned to it?", options: ["Assigned Character", "Unassigned Character", "Surrogate Character", "Supplementary Character"], answer: "Assigned Character"},
        {question: "What is a character that is not decomposable?", options: ["Atomic Character", "Decomposable Character", "Deprecated Character", "Encoded Character"], answer: "Atomic Character"},
        {question: "What is the character except for those with the General Category of Combining Mark?", options: ["Base Character", "Graphic Character", "Neutral Character", "Private-Use Character"], answer: "Base Character"},
        {question: "What is Plane 0, abbreviated as BMP?", options: ["Basic Multilingual Plane", "Supplementary Ideographic Plane", "Supplementary Multilingual Plane", "Tertiary Ideographic Plane"], answer: "Basic Multilingual Plane"},
        {question: "What is a script that distinguishes between two cases?", options: ["Bicameral", "Unicameral", "Titlecase", "Camelcase"], answer: "Bicameral"},
        {question: "What is the abbreviation of bidirectional, referring to mixed left-to-right and right-to-left text?", options: ["RTL", "LTR", "Bidi", "Embedding"], answer: "Bidi"},
        {question: "What is the process or result of mixing left-to-right text and right-to-left text in a single line?", options: ["Bidirectional Display", "Collation", "Normalization", "Symmetric Swapping"], answer: "Bidirectional Display"},
        {question: "What is a computer architecture that stores multiple-byte numerical values with the most significant byte (MSB) values first?", options: ["Little-endian", "Big-endian", "Byte Order Mark", "Endianess"], answer: "Big-endian"},
        {question: "What kind of files contain nontextual information?", options: ["Text Files", "Executable Files", "Binary Files", "Configuration Files"], answer: "Binary Files"},
        {question: "What is a grouping of characters within the Unicode encoding space used for organizing code charts, containing a uniquely named, continuous range of code points?", options: ["Row", "Block", "Cell", "Column"], answer: "Block"},
        {question: "What is a Unicode encoded character having a BMP code point?", options: ["BMP Character", "SMP Character", "TIP character", "U+BOOP Character"], answer: "BMP Character"},
        {question: "What is a Unicode code point between U+0000 and U+FFFF?", options: ["BMP Code Point", "SMP Code Point", "TIP Code Point", "SIP Code Point"], answer: "BMP Code Point"},
        {question: "What is a Unicode compression scheme that is MIME-compatible and preserves binary order?", options: ["BOCU-1", "LZW", "SCSU", "Ductility"], answer: "BOCU-1"},
        {question: "What is an semi-syllabic script used primarily in China to write the sounds of Mandarin Chinese and some other dialects?", options: ["Bopomofo", "Hanyu Pinyin", "Gwoyeu Romatzyh", "Latinxua Sin Wenz"], answer: "Bopomofo"},
        {question: "What is a pattern of writing where alternate lines of text are laid out in opposite directions?", options: ["Boustrophedon", "Writing Direction", "Symmetric Swapping", "Mirrored Property"], answer: "Boustrophedon"},
        {question: "What is a writing system using a series of raised dots to be read with the fingers by people who are blind or whose eyesight is not sufficient for reading printed material?", options: ["Braille", "Moon Type", "Boston Line", "Vibratese"], answer: "Braille"},
        {question: "What is the Unicode character U+FEFF when used to indicate the byte order of a text?", options: ["Byte Order Mark", "Combining Mark", "Enclosing Mark", "Nonspacing Mark"], answer: "Byte Order Mark"},
        {question: "What is the order of a series of bytes determined by a computer architecture?", options: ["Display Order", "Byte Serialization", "Logical Order", "Paragraph Direction"], answer: "Byte Serialization"},
        {question: "What is the reversal of the order of a sequence of bytes?", options: ["Byte-Swapped", "Little-endian", "Big-endian", "Byte Serialization"], answer: "Byte-Swapped"},
        {question: "What is a casing convention where letters are mostly lowercased, but component words or abbreviations may be capitalized?", options: ["Camelcase", "Kebabcase", "Snakecase", "Titlecase"], answer: "Camelcase"},
        {question: "What term refers to something conforming to the general rules for encoding and is not compressed, compacted, or in any other form specified by a higher protocol?", options: ["Canonical", "Conformance", "Core Specification", "Normative"], answer: "Canonical"},
        {question: "What is a step in the algorithm for Unicode Normalization Forms, during which decomposed sequences are replaced by primary composites, where possible?", options: ["Canonical Composition", "Deterministic Sort", "Named Unicode Algorithm", "Unicode Collation Algorithm"], answer: "Canonical Composition"},
        {question: "What is a character that is not identical to its canonical decomposition?", options: ["Canonical Decomposable Character", "Composition Exclusion", "Full Composition Exclusion", "Primary Composite"], answer: "Canonical Decomposable Character"},
        {question: "If the full canonical decompositions of two character sequences are identical, then call them what?", options: ["Canonical Equivalent", "Compatibility Equivalent", "Normalization Form", "Codomain"], answer: "Canonical Equivalent"},
        {question: "What mark is used to indicate how a text is to be chanted or sung?", options: ["Cantillation Mark", "Subtending Mark", "Nonspacing Mark", "Enclosing Mark"], answer: "Cantillation Mark"},
        {question: "What is the association of the uppercase, lowercase, and titlecase forms of a letter?", options: ["Case Mapping", "Decomposition Mapping", "Inner Caps", "Titlecase"], answer: "Case Mapping"},
        {question: "What is a sequence of zero or more case-ignorable characters?", options: ["Case-Sensitive Sequence", "Case-Ignorable Sequence", "Case-Preserving Sequence", "Case-Invariant Sequence"], answer: "Case-Ignorable Sequence"},
        {question: "What mark is placed beneath the letter c in French, Portuguese, and Spanish to indicate that the letter is to be pronounced as an s?", options: ["Tilde", "Cedilla", "Umlaut", "Circumflex"], answer: "Cedilla"},
        {question: "What is a set of characters sharing a particular set of properties?", options: ["Character Encoding Scheme", "Character Set", "Character Class", "Character Entity"], answer: "Character Class"},
        {question: "What is the mapping from a character set definition to the actual code units used to represent the data?", options: ["Character Encoding Scheme", "Coded Character Set", "Character Encoding Form", "Abstract Character"], answer: "Character Encoding Form"},
        {question: "What is a character encoding form plus byte serialization?", options: ["Character Encoding Scheme", "Coded Character Set", "Character Encoding Form", "Abstract Character"], answer: "Character Encoding Scheme"},
        {question: "What is a unique string used to identify each abstract character encoded in the standard?", options: ["Character Name", "Character Name Alias", "Property Value Alias", "Combining Class"], answer: "Character Name"},
        {question: "What is an additional unique string identifier, other than the character name, associated with an encoded character in the standard?", options: ["Character Name", "Character Name Alias", "Property Value Alias", "Combining Class"], answer: "Character Name Alias"},
        {question: "What is a set of property names and property values associated with individual characters?", options: ["Character Properties", "Mathematical Property", "Numeric Value Property", "Mirrored Property"], answer: "Character Properties"},
        {question: "What term refers to any of a set of sonorant consonants in Malayalam when appearing in syllable-final position with no inherent vowel?", options: ["Chilaaksharam", "Candrakkala", "Samvruthokaram", "Praslesham"], answer: "Chilaaksharam"},
        {question: "What is a sequence of one or more leading consonants in Korean?", options: ["Choseong", "Jongseong", "Jungseong", "Jamo"], answer: "Choseong"},
        {question: "What is the name for Han characters used in Vietnam?", options: ["Chữ Hán", "Chữ Nôm", "Quốc Ngữ", "Nôm Na Tống"], answer: "Chữ Hán"},
        {question: "What is a demotic script of Vietnam developed from components of Han characters?", options: ["Chữ Hán", "Chữ Nôm", "Quốc Ngữ", "Nôm Na Tống"], answer: "Chữ Nôm"},
        {question: "What acronym stands for Chinese, Japanese, Korean, and Vietnamese?", options: ["CJK", "CJKV", "GBK", "GB"], answer: "CJKV"},
        {question: "What is the historical version of the character set in which each glyph is assigned a series of bytes?", options: ["Coded Character Set", "Character Set", "Universal Character Set", "Character Repertoire"], answer: "Coded Character Set"},
        {question: "What is a coded character set, often referring to a set used by a personal computer?", options: ["Code Page", "Character Set", "Universal Character Set", "Character Repertoire"], answer: "Code Page"},
        {question: "What is the value in the Unicode codespace; that is, the range of integers from 0x0 to 0x10FFFF?", options: ["Code Point", "Code Page", "Code Unit", "Byte"], answer: "Code Point"},
        {question: "What is the minimal bit combination that can represent a unit of encoded text for processing or interchange?", options: ["Code Point", "Code Page", "Code Unit", "Byte"], answer: "Code Unit"},
        {question: "What is the set of code points or sequences that the mapping maps to, while the domain is the set of values that are mapped?", options: ["Codomain", "Domain", "Range", "Free Group"], answer: "Codomain"},
        {question: "What is the process of ordering units of textual information, also known as alphabetizing or alphabetic sorting?", options: ["Bidirectional Display", "Collation", "Normalization", "Symmetric Swapping"], answer: "Collation"},
        {question: "What is a character with the General Category of Combining Mark (M)?", options: ["Combining Character", "Enclosing Mark", "Graphic Character", "Nonspacing Mark"], answer: "Combining Character"},
        {question: "What is a maximal character sequence consisting of either a base character followed by a sequence of one or more characters where each is a combining character, zero width joiner, or zero width non-joiner; or a sequence of one or more characters where each is a combining character, zero width joiner, or zero width non-joiner?", options: ["Abstract Character Sequence", "Combining Character Sequence", "Escape Sequence", "Mongolian Variation Sequence"], answer: "Combining Character Sequence"},
        {question: "What is a numeric value in the range 0..254 given to each Unicode code point, formally defined as the property Canonical_Combining_Class?", options: ["Combining Class", "Fixed Position Class", "General Category", "Code Point Type"], answer: "Combining Class"},
        {question: "What refers to the consistency with existing practice or preexisting character encoding standards?", options: ["Compatibility", "Core Specification", "Conformance", "Normalization"], answer: "Compatibility"},
        {question: "What is a character that would not have been encoded except for compatibility and round-trip convertibility with other standards?", options: ["Compatibility Character", "Deprecated Character", "Decomposable Character", "Format Character"], answer: "Compatibility Character"},
        {question: "What is a character whose compatibility decomposition is not identical to its canonical decomposition?", options: ["Compatibility Decomposable Character", "Decomposable Character", "Deprecated Character", "Replacement Character"], answer: "Compatibility Decomposable Character"},
        {question: "What is the mapping to a roughly equivalent sequence that may differ in style?", options: ["Compatibility Decomposition", "Compatibility Equivalent", "Compatibility Variant", "Composition Exclusion"], answer: "Compatibility Decomposition"},
        {question: "What is a character that generally can be remapped to another character without loss of information other than formatting?", options: ["Compatibility Variant", "Compatibility Decomposition", "Compatibility Equivalent", "Contextual Variant"], answer: "Compatibility Variant"},
        {question: "What is a Canonical Decomposable Character which has the property value Composition_Exclusion=True?", options: ["Dynamic Composition", "Composition Exclusion", "Non-starter Decomposition", "Full Composition Exclusion"], answer: "Composition Exclusion"},
        {question: "What is adherence to a specified set of criteria for use of a standard?", options: ["Conformance", "Specification", "Standard", "Normalization"], answer: "Conformance"},
        {question: "What term describes characters of similar or identical appearance that can make different identifiers hard or impossible to distinguish?", options: ["Confusable", "Format Character", "Neutral Character", "Noncharacter"], answer: "Confusable"},
        {question: "What is a ligated form representing a consonant conjunct?", options: ["Conjunct Form", "Consonant Cluster", "Virama", "Dead Consonant"], answer: "Conjunct Form"},
        {question: "What is a sequence of two or more consonantal sounds, which may be represented by a single character or a sequence of characters depending on the writing system?", options: ["Conjunct Form", "Consonant Cluster", "Virama", "Dead Consonant"], answer: "Consonant Cluster"},
        {question: "What is a sequence of two or more adjacent consonantal letterforms, consisting of a sequence of one or more dead consonants followed by a normal, live consonant letter?", options: ["Consonant Conjunct", "Leading Consonant", "Trailing Consonant", "Consonant Cluster"], answer: "Consonant Conjunct"},
        {question: "What is the presentation form of a text element that depends on the textual context in which it is rendered?", options: ["Compatibility Variant", "Contextual Variant", "Y-variant", "Z-variant"], answer: "Contextual Variant"},
        {question: "What is a simple property defined to make the statement of a rule defining a derived property more compact or general?", options: ["Contributory Property", "Directionality Property", "Alphabetic Property", "Mirrored Property"], answer: "Contributory Property"},
        {question: "What are the 65 characters in the ranges U+0000..U+001F and U+007F..U+009F also known as?", options: ["Control Characters", "Shaping Characters", "Han Characters", "Noncharacters"], answer: "Control Characters"},
        {question: "What is the central part of the Unicode Standard, consisting of the general introduction, framework for the standard, formal conformance requirements, and extensive chapters providing information about all the encoded characters?", options: ["Core Specification", "Code Charts", "Unicode Standard Annexes", "Unicode Character Database"], answer: "Core Specification"},
        {question: "What type of writing has letters of a word connected?", options: ["Cursive Script", "Abugida", "Demotic Script", "Scriptio Continua"], answer: "Cursive Script"},
        {question: "What is the Greek term for a rough breathing mark, used in polytonic Greek character names?", options: ["Dasia", "Dialytika", "Vrachy", "Psili"], answer: "Dasia"},
        {question: "What is a Indic consonant character followed by a virama character, which indicates that the consonant has lost its inherent vowel?", options: ["Dead Consonant", "Leading Consonant", "Trailing Consonant", "Half-Consonant Form"], answer: "Dead Consonant"},
        {question: "What is a character that is equivalent to a sequence of one or more other characters, according to the decomposition mappings found in the Unicode Character Database, and those described in Section 3.12, Conjoining Jamo Behavior?", options: ["Compatibility Decomposable Character", "Decomposable Character", "Deprecated Character", "Replacement Character"], answer: "Decomposable Character"},
        {question: "What is the process of separating or analyzing a text element into component units, or a sequence of one or more characters that is equivalent to a decomposable character?", options: ["Decomposition", "Composition Exclusion", "Dynamic Composition", "Singleton Decomposition"], answer: "Decomposition"},
        {question: "What is a mapping from a character to a sequence of one or more characters that is a canonical or compatibility equivalent?", options: ["Decomposition Mapping", "Case Mapping", "Transformation Format", "Non-starter Decomposition"], answer: "Decomposition Mapping"},
        {question: "What are the code points that should be ignored by default in rendering unless explicitly supported?", options: ["Default Ignorable", "Private Use", "Reserved Code Point", "Designated Code Point"], answer: "Default Ignorable"},
        {question: "What is a combining character sequence that does not start with a base character?", options: ["Defective Combining Character Sequence", "Combining Character Sequence", "Extended Combining Character Sequence", "Abstract Character Sequence"], answer: "Defective Combining Character Sequence"},
        {question: "What is a script or form of a script used to write the vernacular or common speech of some language community, or a simplified form of the ancient Egyptian hieratic writing?", options: ["Demotic Script", "Hieroglyphic Script", "Hieratic Script", "Greek Script"], answer: "Demotic Script"},
        {question: "What is a symbol or sign that represents a vowel and is attached or combined with another symbol, usually representing a consonant?", options: ["Dependent Vowel", "Independent Vowel", "Inherent Vowel", "Vowel Mark"], answer: "Dependent Vowel"},
        {question: "What term describes a coded character or character property that is strongly discouraged from use?", options: ["Deprecated", "Obsolete", "Noncharacter", "Unassigned Character"], answer: "Deprecated"},
        {question: "What is a coded character whose use is strongly discouraged?", options: ["Atomic Character", "Decomposable Character", "Deprecated Character", "Encoded Character"], answer: "Deprecated Character"},
        {question: "What term refers to any code point that has been assigned to an abstract character or given a normative function by the standard?", options: ["Designated Code Point", "Private-Use Code Point", "Reserved Code Point", "Surrogate Code Point"], answer: "Designated Code Point"},
        {question: "What is a string comparison in which strings that do not have identical contents will compare as unequal, known also as stable (or semi-stable) comparison?", options: ["Deterministic Comparison", "Deterministic Sort", "Stable Sort", "Unicode Collation Algorithm"], answer: "Deterministic Comparison"},
        {question: "What is a sort algorithm which returns exactly the same output each time it is applied to the same input?", options: ["Deterministic Comparison", "Deterministic Sort", "Stable Sort", "Unicode Collation Algorithm"], answer: "Deterministic Sort"},
        {question: "What is a mark applied or attached to a symbol to create a new symbol that represents a modified or new value, or a mark that represents an independent value?", options: ["Diacritic", "Harakat", "Nekudot", "Tanwin"], answer: "Diacritic"},
        {question: "What is the term for two horizontal dots over a letter, as in naïve?", options: ["Diaeresis", "Umlaut", "Nekudot", "Ijam"], answer: "Diaeresis"},
        {question: "What is the Greek term for diaeresis or trema, used in Greek character names?", options: ["Dialytika", "Perispomeni", "Varia", "Vrachy"], answer: "Dialytika"},
        {question: "What is a pair of signs or symbols that together represent a single sound or a single linguistic unit?", options: ["Digraph", "Diacritic", "Independent Vowel", "Tone Mark"], answer: "Digraph"},
        {question: "What term refers to typographical symbols and ornaments?", options: ["Dingbats", "Emoji", "Emoticon", "Pictograph"], answer: "Dingbats"},
        {question: "What is a pair of vowels considered a single vowel for the purpose of phonemic distinction?", options: ["Diphthong", "Jungseong", "Harakat", "Tanwin"], answer: "Diphthong"},
        {question: "What property of every graphic character determines its horizontal ordering?", options: ["Alphabetic Property", "Directionality Property", "Ideographic Property", "Mathematical Property"], answer: "Directionality Property"},
        {question: "What is a rectangular region on a display device within which one or more glyphs are imaged?", options: ["Display Cell", "Bidirectional Display", "Display Order", "Glyph Image"], answer: "Display Cell"},
        {question: "What is the order of glyphs presented in text rendering?", options: ["Display Order", "Logical Order", "Visual Order", "Byte Order"], answer: "Display Order"},
        {question: "What is the set of code points or sequences that are mapped for a mapping?", options: ["Codomain", "Domain", "Range", "Free Group"], answer: "Domain"},
        {question: "What is the coded character set that allows double-byte character encodings to be mixed with single-byte character encodings?", options: ["Double-Byte Character Set", "Multibyte Character Set", "Single-Byte Character Set", "Universal Character Set"], answer: "Double-Byte Character Set"},
        {question: "What term describes the ability of a cursive font to stretch or compress the connective baseline to effect text justification?", options: ["Ductility", "Cursive", "Joiner", "Non-joiner"], answer: "Ductility"},
        {question: "What term refers to the creation of composite forms such as accented letters or Hangul syllables from a sequence of characters?", options: ["Dynamic Composition", "Composition Exclusion", "Non-starter Decomposition", "Full Composition Exclusion"], answer: "Dynamic Composition"},
        {question: "What are the certain pictographic and other symbols encoded in the Unicode Standard that are commonly given a colorful or playful presentation when displayed on devices?", options: ["Emoji", "Kaomoji", "Moji Joho", "Mojibake"], answer: "Emoji"},
        {question: "What is plain text surrounded by formatting information or text recoded to pass through narrow transmission channels?", options: ["Encapsulated Text", "Plain Text", "Rich Text", "Formatted Text"], answer: "Encapsulated Text"},
        {question: "What is a nonspacing mark with the General Category of Enclosing Mark (Me)?", options: ["Accent Mark", "Nonspacing Mark", "Enclosing Mark", "Vowel Mark"], answer: "Enclosing Mark"},
        {question: "What is an association (or mapping) between an abstract character and a code point?", options: ["Atomic Character", "Decomposable Character", "Deprecated Character", "Encoded Character"], answer: "Encoded Character"},
        {question: "What is the process or result of establishing whether two text elements are identical in some respect?", options: ["Equivalence", "Unification", "Normalization", "Rendering"], answer: "Equivalence"},
        {question: "What is a character defined by an end user using a private-use code point to represent a missing character in a particular encoding?", options: ["End-User Defined Character", "Private-Use Character", "Noncharacter", "Reserved Code Point"], answer: "End-User Defined Character"},
        {question: "What are the forms of decimal digits first used in Europe and now used worldwide?", options: ["Arabic-Indic Digits", "Indic Digits", "European Digits", "Mayan Numerals"], answer: "European Digits"},
        {question: "What is a maximal character sequence consisting of either an extended base followed by a sequence of one or more characters where each is a combining character, zero width joiner, or zero width non-joiner; or a sequence of one or more characters where each is a combining character, zero width joiner, or zero width non-joiner?", options: ["Defective Combining Character Sequence", "Combining Character Sequence", "Extended Combining Character Sequence", "Abstract Character Sequence"], answer: "Extended Combining Character Sequence"},
        {question: "What is the text between extended grapheme cluster boundaries as specified by Unicode Standard Annex #29?", options: ["Consonant Cluster", "Extended Grapheme Cluster", "Grapheme Cluster", "Syllable-Initial Cluster"], answer: "Extended Grapheme Cluster"},
        {question: "What is a subset of the range of numeric values for combining classes — specifically, any value in the range 10..199?", options: ["Combining Class", "Fixed Position Class", "Enclosing Mark", "Code Point Type"], answer: "Fixed Position Class"},
        {question: "What is the operation that maps similar characters to a common target, often used to temporarily ignore certain distinctions between characters?", options: ["Case Mapping", "Folding", "Codomain", "Compatibility"], answer: "Folding"},
        {question: "What is a collection of glyph images used for the visual depiction of character data, often associated with a set of parameters such as size and weight?", options: ["Character Repertoire", "Font", "Script", "Glyph Metrics"], answer: "Font"},
        {question: "What is an inherently invisible character that has an effect on the surrounding characters?", options: ["Compatibility Character", "Deprecated Character", "Decomposable Character", "Format Character"], answer: "Format Character"},
        {question: "What is a Canonical Decomposable Character which has the property value Full_Composition_Exclusion=True?", options: ["Canonical Decomposable Character", "Composition Exclusion", "Full Composition Exclusion", "Primary Composite"], answer: "Full Composition Exclusion"},
        {question: "What are characters of East Asian character sets whose glyph image extends across the entire character display cell?", options: ["Fullwidth", "Halfwidth", "Zero Width", "Proportional Width"], answer: "Fullwidth"},
        {question: "What is the partition of the characters into major classes such as letters, punctuation, and symbols, and further subclasses for each of the major classes?", options: ["General Category", "Character Class", "Core Specification", "Enclosing Mark"], answer: "General Category"},
        {question: "What is the overall process for internationalization and localization of software products?", options: ["Globalization", "Vocalization", "Normalization", "Serialization"], answer: "Globalization"},
        {question: "What is an abstract form that represents one or more glyph images?", options: ["Glyph", "Glyph Image", "Character", "Text"], answer: "Glyph"},
        {question: "What is a numeric code that refers to a glyph, usually local to a particular font?", options: ["Glyph Code", "Glyph Identifier", "Glyph Name", "Glyph Image"], answer: "Glyph Code"},
        {question: "What is a label used to refer to a glyph within a font, which may employ both local and global identifiers?", options: ["Glyph Code", "Glyph Identifier", "Glyph Name", "Glyph Image"], answer: "Glyph Identifier"},
        {question: "What is the actual, concrete image of a glyph representation having been rasterized or otherwise imaged onto some display surface?", options: ["Glyph Code", "Glyph Identifier", "Glyph Name", "Glyph Image"], answer: "Glyph Image"},
        {question: "What is a collection of properties that specify the relative size and positioning along with other features of a glyph?", options: ["Glyph Code", "Glyph Identifier", "Glyph Metrics", "Glyph Image"], answer: "Glyph Image"},
        {question: "What is a minimally distinctive unit of writing in a particular writing system or what a user thinks of as a character?", options: ["Grapheme", "Symbol", "Character", "Glyph"], answer: "Grapheme"},
        {question: "What represents a horizontally segmentable unit of text, consisting of a grapheme base together with any number of nonspacing marks applied to it?", options: ["Consonant Cluster", "Extended Grapheme Cluster", "Grapheme Cluster", "Syllable-Initial Cluster"], answer: "Grapheme Cluster"},
        {question: "What is a character with the General Category of Letter (L), Combining Mark (M), Number (N), Punctuation (P), Symbol (S), or Space Separator (Zs)?", options: ["Base Character", "Graphic Character", "Neutral Character", "Private-Use Character"], answer: "Graphic Character"},
        {question: "What are punctuation marks resembling small less-than and greater-than signs, used as quotation marks in French and other languages?", options: ["Guillemets", "Accolades", "Parenthèses", "Crochets"], answer: "Guillemets"},
        {question: "What is the form in the Devanagari script where a dead consonant may be depicted in a half-form without its vertical stem?", options: ["Dead Consonant", "Leading Consonant", "Trailing Consonant", "Half-Consonant Form"], answer: "Half-Consonant Form"},
        {question: "What are characters of East Asian character sets whose glyph image occupies half of the character display cell?", options: ["Fullwidth", "Halfwidth", "Zero Width", "Proportional Width"], answer: "Halfwidth"},
        {question: "What term refers to ideographic characters of Chinese origin?", options: ["Han Characters", "Hanja", "Kanji", "Chữ Hán"], answer: "Han Characters"},
        {question: "What is the Korean name for Han characters?", options: ["Hànzì", "Hanja", "Kanji", "Chữ Hán"], answer: "Hanja"},
        {question: "What is the process of identifying Han characters common among the writing systems of Chinese, Japanese, Korean, and Vietnamese?", options: ["Compatibility", "Han Unification", "Conformance", "Normalization"], answer: "Han Unification"},
        {question: "What is the Mandarin Chinese name for Han characters?", options: ["Hànzì", "Hanja", "Kanji", "Chữ Hán"], answer: "Hànzì"},
        {question: "What are marks used in the Arabic script to indicate vocalization with short vowels, a subtype of tashkil?", options: ["Harakat", "Ijam", "Tanwin", "Tashkil"], answer: "Harakat"},
        {question: "What is the Bangla name for virama?", options: ["Hasant", "Siddhirastu", "Svargiya", "Candrabindu"], answer: "Hasant"},
        {question: "What is any agreement on the interpretation of Unicode characters that extends beyond the scope of the standard, which may be implicit in context?", options: ["Higher-Level Protocol", "IDNA2008 Protocol", "Multipurpose Internet Mail Extensions", "IDNA2003 Protocol"], answer: "Higher-Level Protocol"},
        {question: "What is a Unicode code point in the range U+D800 to U+DBFF?", options: ["High-Surrogate Code Point", "Low-Surrogate Code Point", "Designated Code Point", "Surrogate Pair"], answer: "High-Surrogate Code Point"},
        {question: "What is a 16-bit code unit in the range 0xD800 to 0xDBFF, used in UTF-16 as the leading code unit of a surrogate pair?", options: ["High-Surrogate Code Unit", "Low-Surrogate Code Unit", "Unicode Scalar Value", "Surrogate Pair"], answer: "High-Surrogate Code Unit"},
        {question: "Which syllabary is associated with the Japanese writing system and typically used for native Japanese words and grammatical particles?", options: ["Hiragana", "Katakana", "Romaji", "Kanji"], answer: "Hiragana"},
        {question: "What term refers to a symbol that denotes an idea or concept, or specifically to Han characters in Chinese, Japanese, or Korean terms?", options: ["Abjad", "Alphabet", "Abugida", "Ideograph"], answer: "Ideograph"},
        {question: "What is the informative property of characters that are ideographs?", options: ["Alphabetic Property", "Directionality Property", "Ideographic Property", "Mathematical Property"], answer: "Ideographic Property"},
        {question: "What is a variation sequence registered in the Ideographic Variation Database, involving a base character that must be ideographic and a variation selector in the range U+E0100..U+E01EF?", options: ["Ideographic Variation Sequence", "Mongolian Variation Sequence", "Standardized Variation Sequence", "Ideographic Variation Database"], answer: "Ideographic Variation Sequence"},
        {question: "What is the subset of 9,810 common-use CJK unified ideographs intended for use in East Asian contexts, particularly for small devices?", options: ["IICore", "UnihanCore", "URO", "BMP"], answer: "IICore"},
        {question: "What are diacritical marks applied to basic letter forms to derive new consonant letters for extended Arabic alphabets?", options: ["Harakat", "Ijam", "Tanwin", "Tashkil"], answer: "Ijam"},
        {question: "What is a code unit sequence that does not follow the specification of a Unicode encoding form?", options: ["Ill-Formed Code Unit Sequence", "Ill-Formed Code Unit Subsequence", "Well-Formed Code Unit Sequence", "Unicode String"], answer: "Ill-Formed Code Unit Sequence"},
        {question: "What is a non-empty subsequence of a Unicode code unit sequence that does not contain any code units which also belong to any minimal well-formed subsequence of the sequence?", options: ["Ill-Formed Code Unit Sequence", "Ill-Formed Code Unit Subsequence", "Well-Formed Code Unit Sequence", "Minimal Well-Formed Code Unit Subsequence"], answer: "Ill-Formed Code Unit Subsequence"},
        {question: "What term describes an information channel that embeds information within the text itself with special syntax to distinguish it?", options: ["In-Band", "Out-of-Band", "Encapsulated Text", "Unicode String"], answer: "In-Band"},
        {question: "In Indic scripts, what term is used for vowels depicted using independent letter symbols that stand on their own?", options: ["Dependent Vowel", "Independent Vowel", "Inherent Vowel", "Vowel Mark"], answer: "Independent Vowel"},
        {question: "What term refers to the forms of decimal digits used in various Indic scripts?", options: ["Arabic-Indic Digits", "Indic Digits", "European Digits", "Mayan Numerals"], answer: "Indic Digits"},
        {question: "What term describes information in the Unicode standard that is not normative but contributes to the correct use and implementation of the standard?", options: ["Informative", "Normative", "Canonical", "Compatibility"], answer: "Informative"},
        {question: "In writing systems based on Brahmi family scripts, what term is used for a consonant letter symbol that normally has a default vowel?", options: ["Dependent Vowel", "Independent Vowel", "Inherent Vowel", "Vowel Mark"], answer: "Inherent Vowel"},
        {question: "What term describes the mixed case format where an uppercase letter is in a position other than first in the word?", options: ["Inner Caps", "Camelcase", "Small Caps", "Drop Caps"], answer: "Inner Caps"},
        {question: "What is a UI-based method of inputting characters with more flexibility than a traditional keyboard?", options: ["Input Method Editor", "Typewriter", "Teletype", "Keyboard"], answer: "Input Method Editor"},
        {question: "What is the process of designing software so it can be easily localized with few structural changes?", options: ["Globalization", "Internationalization", "Normalization", "Serialization"], answer: "Internationalization"},
        {question: "What term is used for a domain name that includes at least one character outside the ASCII range?", options: ["Internationalized Domain Name", "Punycode", "Internationalized Resource Identifier", "Percent-Encoding"], answer: "Internationalized Domain Name"},
        {question: "What is the character encoding standard maintained by ISO in synchronization with the Unicode Standard?", options: ["ISO/IEC 10646", "ISO/IEC 2022", "ISO/IEC 646", "ISO/IEC 8859"], answer: "ISO/IEC 10646"},
        {question: "What is the Korean name for a single letter of the Hangul script?", options: ["Choseong", "Jongseong", "Jungseong", "Jamo"], answer: "Jamo"},
        {question: "What term refers to a sequence of one or more trailing consonants in Korean?", options: ["Choseong", "Jongseong", "Jungseong", "Jamo"], answer: "Jongseong"},
        {question: "What term refers to a sequence of one or more vowels in Korean?", options: ["Choseong", "Jongseong", "Jungseong", "Jamo"], answer: "Jungseong"},
        {question: "What is the collective term for the two syllabic scripts used in the Japanese writing system?", options: ["Kana", "Emoji", "Romaji", "Kanji"], answer: "Kana"},
        {question: "What is the Japanese name for Han characters?", options: ["Hànzì", "Hanja", "Kanji", "Chữ Hán"], answer: "Kanji"},
        {question: "What syllabary is typically used in Japanese for borrowed vocabulary, some plant or animal names, and sound-symbolic interjections?", options: ["Hiragana", "Katakana", "Romaji", "Kanji"], answer: "Katakana"},
        {question: "What is the process of changing the space between certain pairs of letters to improve the appearance of text?", options: ["Kerning", "Tracking", "Spacing", "Leading"], answer: "Kerning"},
        {question: "What is an element of an alphabet, which in a broad sense includes elements of syllabaries and ideographs?", options: ["Letter", "Glyph", "Character", "Symbol"], answer: "Letter"},
        {question: "What is a glyph representing a combination of two or more characters, such as those between “f” and “i” or “f” and “l”?", options: ["Ligature", "Conjunct", "Digraph", "Half-Consonant Form"], answer: "Ligature"},
        {question: "What is the computer architecture that stores multiple-byte numerical values with the least significant byte first?", options: ["Little-endian", "Big-endian", "Byte Order Mark", "Endianess"], answer: "Little-endian"},
        {question: "What is the process of adapting a software product to use the languages and conventions suitable for a local market?", options: ["Globalization", "Internationalization", "Localization", "Normalization"], answer: "Localization"},
        {question: "What is the order in which text is stored in the memory representation, usually corresponding to the typing order and phonetic order?", options: ["Display Order", "Byte Serialization", "Logical Order", "Paragraph Direction"], answer: "Logical Order"},
        {question: "What is any symbol that primarily represents a word or morpheme, in contrast to a sound or pronunciation?", options: ["Logograph", "Pictograph", "Sign", "Letter"], answer: "Logograph"},
        {question: "What type of writing system primarily uses units to write words and/or morphemes with some subsidiary usage to represent syllabic sounds?", options: ["Abjad", "Alphabet", "Abugida", "Logosyllabary"], answer: "Logosyllabary"},
        {question: "What is a Unicode code point in the range U+DC00 to U+DFFF?", options: ["High-Surrogate Code Point", "Low-Surrogate Code Point", "Designated Code Point", "Surrogate Pair"], answer: "Low-Surrogate Code Point"},
        {question: "What is a 16-bit code unit in the range 0xDC00 to 0xDFFF, used in UTF-16 as the trailing code unit of a surrogate pair?", options: ["High-Surrogate Code Unit", "Low-Surrogate Code Unit", "Unicode Scalar Value", "Surrogate Pair"], answer: "Low-Surrogate Code Unit"},
        {question: "What is the informative property of characters that are used as operators in mathematical formulae?", options: ["Alphabetic Property", "Directionality Property", "Ideographic Property", "Mathematical Property"], answer: "Mathematical Property"},
        {question: "What is the name for a dependent vowel in an Indic script, often with a different letterform from the same vowel used as an independent letter?", options: ["Matra", "Halant", "Repha", "Nukta"], answer: "Matra"},
        {question: "What term refers to a well-formed Unicode code unit sequence that maps to a single Unicode scalar value?", options: ["Ill-Formed Code Unit Sequence", "Ill-Formed Code Unit Subsequence", "Well-Formed Code Unit Sequence", "Minimal Well-Formed Code Unit Subsequence"], answer: "Minimal Well-Formed Code Unit Subsequence"},
        {question: "What property describes characters whose images are mirrored horizontally in text laid out from right to left?", options: ["Character Properties", "Mathematical Property", "Numeric Value Property", "Mirrored Property"], answer: "Mirrored Property"},
        {question: "What is a character with the Lm General Category in the Unicode Character Database that modifies the pronunciation of other letters?", options: ["Modifier Letter", "Lowercase Letter", "Uppercase Letter", "Titlo Letter"], answer: "Modifier Letter"},
        {question: "What is a subset of variation selectors, encoded in the range U+180B..U+180D and U+180F, used specifically for the Mongolian script?", options: ["Mongolian Free Variation Selector", "Mongolian Vowel Separator", "Narrow No-Break Space", "General-Use Variation Selector"], answer: "Mongolian Free Variation Selector"},
    ];

    let currentQuestionIndex = 0;
    function loadQuestion() {
        const questionEl = document.getElementById('question');
        const optionsEl = document.getElementById('options');
        const currentQuestion = questions[currentQuestionIndex];
        questionEl.textContent = currentQuestion.question;
        optionsEl.innerHTML = '';
        currentQuestion.options.sort(() => Math.random() - 0.5).forEach(option => {
            const optionBtn = document.createElement('div');
            optionBtn.classList.add('option');
            optionBtn.textContent = option;
            optionBtn.onclick = () => {
                if (option === currentQuestion.answer) {
                    optionBtn.classList.add('correct');
                } else {
                    optionBtn.classList.add('incorrect');
                    document.querySelectorAll('.option').forEach(opt => {
                        if (opt.textContent === currentQuestion.answer) {
                            opt.classList.add('correct');
                        }
                    });
                }
                setTimeout(() => {
                    currentQuestionIndex = Math.floor(Math.random() * questions.length);
                    loadQuestion();
                }, 1000);
            };
            optionsEl.appendChild(optionBtn);
        });
    }
    loadQuestion();
</script>