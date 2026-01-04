package moe.cha.app.apk.randompicker;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Keep WebView below the status & navigation bars to avoid content being covered.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
