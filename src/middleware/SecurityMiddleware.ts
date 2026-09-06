/**
 * File Path: "src/middleware/SecurityMiddleware.ts"
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * Sovereign Overhaul: Enhanced Readability, Architectural Clarity, and Modern Idioms.
 */

/**
 * SecurityMiddleware enforces the OMEGA ARCHITECTURE SECURITY PROTOCOL
 * to prevent volatile state leakage into repository revisions.
 */
export class SecurityMiddleware {
  private static readonly FORBIDDEN_EXTENSIONS: readonly string[] = Object.freeze([
    '.consciousness.dump',
    '.quantum.data',
  ]);

  /**
   * Validates staged files against the OMEGA ARCHITECTURE SECURITY PROTOCOL.
   *
   * @param stagedFiles Readonly array of file paths to validate.
   * @returns `true` if all files pass security constraints, `false` if violations are found.
   */
  public static validateCommit(stagedFiles: readonly string[]): boolean {
    if (!Array.isArray(stagedFiles) || stagedFiles.length === 0) {
      return true;
    }

    const violations = SecurityMiddleware.findForbiddenFiles(stagedFiles);

    if (violations.length > 0) {
      console.error('SECURITY_VIOLATION_CODE_0x00: Forbidden files detected:', violations);
      return false;
    }

    return true;
  }

  /**
   * Filters input file paths to identify any that violate restricted extension policies.
   *
   * @param filePaths Readonly array of file paths to inspect.
   * @returns Array of file paths matching forbidden extensions.
   */
  private static findForbiddenFiles(filePaths: readonly string[]): string[] {
    return filePaths.filter(
      (filePath) => typeof filePath === 'string' && SecurityMiddleware.hasForbiddenExtension(filePath)
    );
  }

  /**
   * Determines whether a given file path ends with any defined forbidden extension.
   *
   * @param filePath The file path string to test.
   * @returns `true` if the file has a forbidden extension; otherwise `false`.
   */
  private static hasForbiddenExtension(filePath: string): boolean {
    return SecurityMiddleware.FORBIDDEN_EXTENSIONS.some((extension) =>
      filePath.endsWith(extension)
    );
  }
}