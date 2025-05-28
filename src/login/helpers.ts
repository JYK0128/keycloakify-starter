import { FormFieldState } from 'keycloakify/login/lib/getUserProfileApi';
import type { Dictionary } from 'lodash';
import { z, ZodError, ZodTypeAny } from 'zod';

export function transformZodValidator(formFields: Dictionary<FormFieldState>) {
  const resolver: Record<string, z.ZodTypeAny> = {};

  for (const [fieldKey, options] of Object.entries(formFields)) {
    const zodValidators: z.ZodTypeAny[] = [];
    const validators = options.attribute.validators;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [ruleKey, rule] of Object.entries(validators as Record<string, any>)) {
      let schema: ZodTypeAny;
      switch (ruleKey) {
        case 'double': {
          schema = z.coerce.number()
            .min(rule.min)
            .max(rule.max);
          break;
        }
        case 'integer': {
          schema = z.coerce.number().int()
            .min(rule.min)
            .max(rule.max);
          break;
        }
        case 'email': {
          schema = z.coerce.string().email()
            .max(rule['max-local-length']);
          break;
        }
        case 'url': {
          schema = z.coerce.string().url()
            .startsWith(rule.allowedSchemes)
            .refine((v) => !(!rule.allowFragment && v.includes('#')));
          break;
        }
        case 'length': {
          schema = z.union([
            z.string().min(rule.min).max(rule.max),
            z.unknown().array().min(rule.min).max(rule.max),
          ]);
          break;
        }
        case 'options': {
          schema = z.enum(rule.options);
          break;
        }
        case 'local-date':
        case 'iso-date': {
          schema = z.coerce.date();
          break;
        }
        case 'pattern': {
          schema = z.coerce.string().regex(new RegExp(rule.pattern));
          break;
        }
        default: {
          schema = z.any();
        }
      }

      if (!options.attribute.required) {
        schema = schema.optional();
      }
      if (options.attribute.multivalued) {
        schema = schema.array().min(rule.min).max(rule.max);
      }
      zodValidators.push(schema);
    }
    const fieldSchema = z.unknown().transform((v, ctx) => {
      for (const validator of zodValidators) {
        try {
          validator.parse(v);
        }
        catch (e) {
          let message;
          if (e instanceof ZodError) {
            message = e.errors.at(0)?.message;
          }
          else if (e instanceof Error) {
            message = e.message;
          }
          ctx.addIssue({
            code: 'custom',
            message,
          });
          break;
        }
      }
    });

    resolver[fieldKey] = fieldSchema;
  }

  return z.object(resolver);
}
