function AuthVisualPanel() {
    return (
        <div className="auth-visual">
            <div className="auth-visual-circle-top" />
            <div className="auth-visual-circle-bottom" />

            <div className="auth-info-card">
                <div className="auth-logo-badge">📚</div>
                <h2 className="auth-brand-name">Waraq  ورق</h2>
                <p className="auth-brand-tagline">Your book marketplace</p>

                <div className="auth-features">
                    <div className="auth-feature">
                        <div className="auth-feature-icon">💰</div>
                        <div>
                            <p className="auth-feature-title">List your books</p>
                            <p className="auth-feature-desc">Sell unused textbooks in minutes</p>
                        </div>
                    </div>

                    <div className="auth-feature">
                        <div className="auth-feature-icon">🔄</div>
                        <div>
                            <p className="auth-feature-title">Swap with students</p>
                            <p className="auth-feature-desc">Exchange books across universities</p>
                        </div>
                    </div>

                    <div className="auth-feature">
                        <div className="auth-feature-icon">🔍</div>
                        <div>
                            <p className="auth-feature-title">Find any book</p>
                            <p className="auth-feature-desc">Browse thousands of listings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthVisualPanel;