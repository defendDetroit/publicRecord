//! Diagnostic report — shared pattern for verification output.
//!
//! Both detroit-build and spore-validate accumulate errors, warnings,
//! and informational stats during validation and display them.

/// Severity level for a diagnostic message.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Level {
    Info,
    Warning,
    Error,
}

/// A single diagnostic message with severity.
#[derive(Debug, Clone)]
pub struct Diagnostic {
    pub level: Level,
    pub message: String,
}

/// Accumulator for verification diagnostics.
#[derive(Debug, Default)]
pub struct Report {
    pub diagnostics: Vec<Diagnostic>,
}

impl Report {
    #[must_use]
    pub fn new() -> Self {
        Self::default()
    }

    /// Add an info-level diagnostic.
    pub fn info(&mut self, msg: impl Into<String>) {
        self.diagnostics.push(Diagnostic {
            level: Level::Info,
            message: msg.into(),
        });
    }

    /// Add a warning-level diagnostic.
    pub fn warn(&mut self, msg: impl Into<String>) {
        self.diagnostics.push(Diagnostic {
            level: Level::Warning,
            message: msg.into(),
        });
    }

    /// Add an error-level diagnostic.
    pub fn error(&mut self, msg: impl Into<String>) {
        self.diagnostics.push(Diagnostic {
            level: Level::Error,
            message: msg.into(),
        });
    }

    /// Returns true if any errors were reported.
    #[must_use]
    pub fn has_errors(&self) -> bool {
        self.diagnostics.iter().any(|d| d.level == Level::Error)
    }

    /// Count of error-level diagnostics.
    #[must_use]
    pub fn error_count(&self) -> usize {
        self.diagnostics
            .iter()
            .filter(|d| d.level == Level::Error)
            .count()
    }

    /// Count of warning-level diagnostics.
    #[must_use]
    pub fn warning_count(&self) -> usize {
        self.diagnostics
            .iter()
            .filter(|d| d.level == Level::Warning)
            .count()
    }

    /// Print all diagnostics to stdout with emoji prefixes.
    pub fn print(&self) {
        for d in &self.diagnostics {
            let prefix = match d.level {
                Level::Info => "  \u{2705}",
                Level::Warning => "  \u{26a0}\u{fe0f} ",
                Level::Error => "  \u{274c}",
            };
            println!("{prefix} {}", d.message);
        }
    }

    /// Merge another report into this one.
    pub fn merge(&mut self, other: Report) {
        self.diagnostics.extend(other.diagnostics);
    }
}
