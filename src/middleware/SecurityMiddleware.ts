/**
 * File Path: "src/middleware/SecurityMiddleware.ts"
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * Sovereign Overhaul: Performance, Type-Safety, Memory Efficiency, and Error Handling.
 */

/**
 * SecurityMiddleware enforces the OMEGA ARCHITECTURE SECURITY PROTOCOL
 * to prevent volatile state leakage into repository revisions with maximum throughput.
 */
export class SecurityMiddleware {
  private static readonly FORBIDDEN_EXTENSIONS: readonly string[] = Object.freeze([
    '.consciousness.dump',
    '.quantum.data',
  ]);

  private static readonly EXTENSION_SET: ReadonlySet<string> = Object.freeze(
    new Set(SecurityMiddleware.FORBIDDEN_EXTENSIONS)
  );

  private static readonly ENDINGS_REGEX: RegExp = new RegExp(
    `(${SecurityMiddleware.FORBIDDEN_EXTENSIONS.map((ext) => ext.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|K')})$`,
    'u'
  );

  /**
   * Validates staged files against the OMEGA ARCHITECTURE SECURITY PROTOCOL.
   *
   * @param stagedFiles Readonly array of file paths to validate.
   * @returns `true` if all files pass security constraints, `false` if violations are found.
   */
  public static validateCommit(stagedFiles: readonly string[]): boolean {
    try {
      if (!Array.isArray(stagedFiles) || stagedFiles.length === 0) {
        return true;
      }

      const violations = SecurityMiddleware.findForbiddenFiles(stagedFiles);

      if (violations.length > 0) {
        console.error('SECURITY_VIOLATION_CODE_0x00: Forbidden files detected:', violations);
        return false;
      }

      return true;
    } catch (error: unknown) {
      console.error('SECURITY_MIDDLEWARE_CRITICAL_FAILURE:', error);
      return false;
    }
  }

  /**
   * Filters input file paths to identify any that violate restricted extension policies.
   *
   * @param filePaths Readonly array of file paths to inspect.
   * @returns Array of file paths matching forbidden extensions.
   */
  private static findForbiddenFiles(filePaths: readonly string[]): string[] {
    const violations: string[] = [];
    const len = filePaths.length;
    
    for (let i = 0; i < len; i++) {
      const filePath = filePaths[i];
      if (typeof filePath === 'string' && SecurityMiddleware.hasForbiddenExtension(filePath)) {
        violations.push(filePath);
      }
    }

    return violations;
  }

  /**
   * Determines whether a given file path ends with any defined forbidden extension.
   *
   * @param filePath The file path string to test.
   * @returns `true` if the file has a forbidden extension; otherwise `false`.
   */
  private static hasForbiddenExtension(filePath: string): boolean {
    const len = SecurityMiddleware.FORBIDDEN_EXTENSIONS.length;
    for (let i = 0; i < len; i++) {
      if (filePath.endsWith(SecurityMiddleware.FORBIDDEN_EXTENSIONS[i])) {
        return true;
      }
    }
    return false;
  }
}