exports.default = async function(configuration) {
    require("child_process").execSync(
        `java \
        -jar jsign.jar \
        --storetype AWS \
        --keystore "${process.env.AWS_REGION}" \
        --storepass "${process.env.AWS_ACCESS_KEY}|${process.env.AWS_SECRET_KEY}" \
        --alias "${process.env.KMS_ARN}" \
        --certfile "${process.env.CERT_PATH}" \
        --alg "SHA256" \
        --tsaurl "http://timestamp.digicert.com" \
        --tsretries 10 \
        --replace \
        "${configuration.path}"
        `,
        { stdio: "inherit"}
    );
};