import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '@/lib/validators/auth';

// ─── registerSchema ─────────────────────────────────────────────────────────

describe('registerSchema', () => {
  const valid = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'StrongPass1',
    role: 'buyer' as const,
  };

  it('accepts valid buyer registration', () => {
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('accepts valid creator registration', () => {
    const result = registerSchema.safeParse({ ...valid, role: 'creator' });
    expect(result.success).toBe(true);
  });

  it('defaults role to buyer when omitted', () => {
    const { role: _role, ...noRole } = valid;
    const result = registerSchema.safeParse(noRole);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('buyer');
    }
  });

  it('trims and lowercases email', () => {
    const result = registerSchema.safeParse({ ...valid, email: '  ALICE@Example.COM  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('alice@example.com');
    }
  });

  it('trims name', () => {
    const result = registerSchema.safeParse({ ...valid, name: '  Alice  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Alice');
    }
  });

  it('rejects empty name', () => {
    const result = registerSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name exceeding 100 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects empty email', () => {
    const result = registerSchema.safeParse({ ...valid, email: '' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'Abc1' });
    expect(result.success).toBe(false);
  });

  it('rejects password exceeding 128 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'Aa1' + 'x'.repeat(126) });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'alllower1' });
    expect(result.success).toBe(false);
  });

  it('rejects password without lowercase', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'ALLUPPER1' });
    expect(result.success).toBe(false);
  });

  it('rejects password without number', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'NoNumbers' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid role', () => {
    const result = registerSchema.safeParse({ ...valid, role: 'admin' });
    expect(result.success).toBe(false);
  });
});

// ─── loginSchema ────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  const valid = { email: 'user@test.com', password: 'mypassword' };

  it('accepts valid login input', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it('trims and lowercases email', () => {
    const result = loginSchema.safeParse({ ...valid, email: '  USER@Test.com  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@test.com');
    }
  });

  it('rejects empty email', () => {
    expect(loginSchema.safeParse({ ...valid, email: '' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(loginSchema.safeParse({ ...valid, email: 'bademail' }).success).toBe(false);
  });

  it('rejects empty password', () => {
    expect(loginSchema.safeParse({ ...valid, password: '' }).success).toBe(false);
  });
});

// ─── forgotPasswordSchema ───────────────────────────────────────────────────

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'user@test.com' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'nope' }).success).toBe(false);
  });

  it('rejects empty email', () => {
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  });
});

// ─── resetPasswordSchema ────────────────────────────────────────────────────

describe('resetPasswordSchema', () => {
  const valid = {
    token: 'abc123def456',
    password: 'NewPass99',
    confirmPassword: 'NewPass99',
  };

  it('accepts valid reset input', () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty token', () => {
    expect(resetPasswordSchema.safeParse({ ...valid, token: '' }).success).toBe(false);
  });

  it('rejects weak password (no uppercase)', () => {
    expect(
      resetPasswordSchema.safeParse({
        ...valid,
        password: 'lowercase1',
        confirmPassword: 'lowercase1',
      }).success
    ).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = resetPasswordSchema.safeParse({
      ...valid,
      confirmPassword: 'Different1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = result.error.issues.map((i) => i.message);
      expect(msgs).toContain('Passwords do not match');
    }
  });

  it('rejects password shorter than 8 chars', () => {
    expect(
      resetPasswordSchema.safeParse({ ...valid, password: 'Sh1', confirmPassword: 'Sh1' }).success
    ).toBe(false);
  });
});

// ─── changePasswordSchema ───────────────────────────────────────────────────

describe('changePasswordSchema', () => {
  const valid = {
    currentPassword: 'OldPassword1',
    newPassword: 'NewPassword1',
    confirmPassword: 'NewPassword1',
  };

  it('accepts valid change-password input', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty currentPassword', () => {
    expect(changePasswordSchema.safeParse({ ...valid, currentPassword: '' }).success).toBe(false);
  });

  it('rejects weak newPassword', () => {
    expect(
      changePasswordSchema.safeParse({
        ...valid,
        newPassword: 'nouppercase1',
        confirmPassword: 'nouppercase1',
      }).success
    ).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      confirmPassword: 'WrongConfirm1',
    });
    expect(result.success).toBe(false);
  });
});
