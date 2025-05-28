import { FormCheckbox, FormController, FormInput } from '#/customs';
import { Button } from '#/shadcn/components/ui';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: 'login-config-totp.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const form = useForm({
    defaultValues: {
      'totp': '',
      'userLabel': '',
      'logout-sessions': false,
    },
  });

  const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;

  const { msg, msgStr, advancedMsg } = i18n;

  useEffect(() => {
    if (messagesPerField.getFirstError('totp')) {
      form.setError('totp', {
        type: 'custom',
        message: messagesPerField.get('totp'),
      });
    }
    if (messagesPerField.getFirstError('userLabel')) {
      form.setError('userLabel', {
        type: 'custom',
        message: messagesPerField.get('userLabel'),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg('loginTotpTitle')}
      displayMessage={!messagesPerField.existsError('totp', 'userLabel')}
    >
      <ul className="[&>li]:pb-4">
        <li>
          <p>{msg('loginTotpStep1')}</p>

          <ul className="pl-4">
            {totp.supportedApplications.map((app) => (
              <li key={app}>{advancedMsg(app)}</li>
            ))}
          </ul>
        </li>

        {mode === 'manual'
          ? (
            <>
              <li>
                <p>{msg('loginTotpManualStep2')}</p>
                <p>
                  <span id="kc-totp-secret-key">{totp.totpSecretEncoded}</span>
                </p>
                <p>
                  <Button className="text-link font-bold" variant="ghost" asChild>
                    <a href={totp.qrUrl} id="mode-barcode">
                      {msg('loginTotpScanBarcode')}
                    </a>
                  </Button>
                </p>
              </li>
              <li>
                <p>{msg('loginTotpManualStep3')}</p>
                <ul className="pl-4">
                  <li id="kc-totp-type">
                    {msg('loginTotpType')}
                    :
                    {msg(`loginTotp.${totp.policy.type}`)}
                  </li>
                  <li id="kc-totp-algorithm">
                    {msg('loginTotpAlgorithm')}
                    :
                    {totp.policy.getAlgorithmKey()}
                  </li>
                  <li id="kc-totp-digits">
                    {msg('loginTotpDigits')}
                    :
                    {totp.policy.digits}
                  </li>
                  {totp.policy.type === 'totp'
                    ? (
                      <li id="kc-totp-period">
                        {msg('loginTotpInterval')}
                        :
                        {totp.policy.period}
                      </li>
                    )
                    : (
                      <li id="kc-totp-counter">
                        {msg('loginTotpCounter')}
                        :
                        {totp.policy.initialCounter}
                      </li>
                    )}
                </ul>
              </li>
            </>
          )
          : (
            <li>
              <p>{msg('loginTotpStep2')}</p>
              <img id="kc-totp-secret-qr-code" src={`data:image/png;base64, ${totp.totpSecretQrCode}`} alt="Figure: Barcode" />
              <br />
              <p>
                <a href={totp.manualUrl} id="mode-manual">
                  {msg('loginTotpUnableToScan')}
                </a>
              </p>
            </li>
          )}
        <li>
          <p>{msg('loginTotpStep3')}</p>
          <p>{msg('loginTotpStep3DeviceName')}</p>
        </li>
      </ul>

      <FormController {...form} action={url.loginAction} method="post">
        <FormInput
          control={form.control}
          required
          name="totp"
          showError
          label={msg('authenticatorCode')}
          labelWidth="120px"
        />
        <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
        {mode && <input type="hidden" id="mode" value={mode} />}

        <FormInput
          control={form.control}
          required={!!totp.otpCredentials.length}
          name="userLabel"
          showError
          label={msg('loginTotpDeviceName')}
          labelWidth="120px"
        />

        <FormCheckbox
          control={form.control}
          name="logout-sessions"
          label={msg('logoutOtherSessions')}
        />

        <div className="flex justify-end">
          {isAppInitiatedAction
            && (
              <Button
                type="submit"
                name="cancel-aia"
                value="true"
                variant="outline"
                formNoValidate
              >
                {msg('doCancel')}
              </Button>
            )}
          <Button
            type="submit"
          >
            {msgStr('doSubmit')}
          </Button>
        </div>
      </FormController>
    </Template>
  );
}
